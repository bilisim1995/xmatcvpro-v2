import { NextResponse } from 'next/server';
import { AdultModel } from '@/lib/mongodb/db';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { calculateSimilarity } from '@/lib/mongodb/db';
import { SearchResult, ModelFilters } from '@/lib/api/types';
import { Types, Document } from 'mongoose';

export const dynamic = 'force-dynamic';

const REQUEST_TIMEOUT = 60000; // 60 seconds timeout
const BATCH_SIZE = 100; // Process models in batches
const MIN_CONFIDENCE = 35; // Minimum confidence threshold

interface ModelDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug?: string;
  profile_image: string;
  link?: string;
  age?: number;
  height?: { value: number };
  weight?: { value: number };
  cup_size?: string;
  nationality?: string[];
  ethnicity?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: { has_tattoos: boolean; };
  piercings?: { has_piercings: boolean };
  face_data?: {
    descriptor: number[];
  };
}

interface SearchRequestBody {
  descriptor?: number[];
  filters?: Record<string, unknown>;
}

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { message: 'Invalid content type' },
        { status: 400 }
      );
    }

    const { descriptor, filters } = await req.json() as SearchRequestBody;

    if (!descriptor || !Array.isArray(descriptor)) {
      return NextResponse.json(
        { message: 'Invalid face descriptor' },
        { status: 400 }
      );
    }

    try {
      await connect();

      const query: Record<string, string | number | boolean | { $regex: RegExp }> = {};
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (!value) return;
          switch (key) {
            case 'age':
              query.age = Number(value);
              break;
            case 'height':
              query['height.value'] = Number(value);
              break;
            case 'weight':
              query['weight.value'] = Number(value);
              break;
            case 'cup_size':
              query.cup_size = { $regex: new RegExp(`^${String(value)}$`, 'i') };
              break;
            case 'nationality':
            case 'ethnicity':
            case 'hair_color':
            case 'eye_color':
              query[key] = { $regex: new RegExp(String(value), 'i') };
              break;
            case 'tattoos':
              query['tattoos.has_tattoos'] = value === 'yes';
              break;
            case 'piercings':
              query['piercings.has_piercings'] = value === 'yes';
              break;
          }
        });
      }

      const projection = 'name slug profile_image link age height weight cup_size nationality ethnicity hair_color eye_color tattoos piercings face_data';
      const cursor = AdultModel.find(query).select(projection).cursor();

      let allResults: SearchResult[] = [];
      let batch: ModelDocument[] = [];

      for await (const model of cursor) {
        if (!model || !(model._id instanceof Types.ObjectId)) continue;
        batch.push(model);

        if (batch.length === BATCH_SIZE) {
          const results = processBatch(batch, descriptor);
          allResults.push(...results);
          batch = [];

          if (allResults.length >= 16) break;
        }
      }

      if (batch.length > 0 && allResults.length < 16) {
        const results = processBatch(batch, descriptor);
        allResults.push(...results);
      }

      const sortedResults = allResults
        .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
        .slice(0, 16);

      return NextResponse.json(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    } finally {
      clearTimeout(timeoutId);
      controller.abort();
      await disconnect();
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

function processBatch(batch: ModelDocument[], descriptor: number[]): SearchResult[] {
  return batch
    .filter(model => 
      Array.isArray(model.face_data?.descriptor) &&
      model.face_data.descriptor.length === descriptor.length
    )
    .map(model => {
      const similarity = calculateSimilarity(descriptor, model.face_data!.descriptor);
      if (similarity < MIN_CONFIDENCE) return null;

      return {
        id: model._id.toString(),
        name: model.name || 'Unknown',
        slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-') || '',
        image: model.profile_image || '/default.png',
        link1: model.link,
        age: model.age,
        height: model.height?.value,
        weight: model.weight?.value,
        cup_size: model.cup_size,
        nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
        ethnicity: model.ethnicity,
        hair: model.hair_color,
        eyes: model.eye_color,
        tats: model.tattoos?.has_tattoos === true ? 'yes' : 'no',
        piercings: model.piercings?.has_piercings === true ? 'yes' : 'no',
        confidence: similarity
      } as SearchResult;
    })
    .filter((r): r is SearchResult => r !== null);
}
