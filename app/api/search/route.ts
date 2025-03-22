import { NextResponse } from 'next/server';
import { AdultModel } from '@/lib/mongodb/db';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { calculateSimilarity } from '@/lib/mongodb/db';
import { SearchResult } from '@/lib/api/types';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

export const dynamic = 'force-dynamic';

const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

interface ModelDocument {
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
  tattoos?: { has_tattoos: boolean };
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
    // Handle preflight
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

    // Request validation
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
      // Connect to MongoDB
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

      // Find models and calculate similarity scores
      const models = await AdultModel
        .find(query)
        .select('name slug profile_image link age height weight cup_size nationality ethnicity hair_color eye_color tattoos piercings face_data')
        .lean()
        .exec() as unknown as ModelDocument[];

      if (!models.length) {
        return NextResponse.json(
          { message: 'No models found' },
          { status: 404 }
        );
      }

      // Calculate similarity scores and sort results
      const results = models
        .filter(model => model.face_data?.descriptor)
        .map((model) => {
          // Safely access face_data.descriptor with type guard
          if (!model.face_data?.descriptor) {
            return null;
          }
          
          const similarity = calculateSimilarity(descriptor, model.face_data.descriptor);
          const result: SearchResult = {
            id: model._id.toString(),
            name: model.name,
            slug: model.slug || model.name.toLowerCase().replace(/\s+/g, '-'),
            image: model.profile_image,
            link1: model.link,
            age: model.age,
            height: model.height?.value,
            weight: model.weight?.value,
            cup_size: model.cup_size,
            nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
            ethnicity: model.ethnicity,
            hair: model.hair_color,
            eyes: model.eye_color,
            tats: model.tattoos?.has_tattoos ? 'yes' : 'no',
            piercings: model.piercings?.has_piercings ? 'yes' : 'no',
            confidence: similarity
          } as const;
          
          return result;
        })
        .filter((result): result is SearchResult => result !== null)
        .filter((result): result is SearchResult & { confidence: number } => 
          typeof result.confidence === 'number' && result.confidence > 0
        )
        .sort((a, b) => b.confidence - a.confidence);

      return NextResponse.json(results);

    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutId);
    controller.abort();
    await disconnect();
  }
}