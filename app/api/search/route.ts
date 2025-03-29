import { NextResponse } from 'next/server';
import { AdultModel } from '@/lib/mongodb/db';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { calculateSimilarity } from '@/lib/mongodb/db';
import { SearchResult } from '@/lib/api/types';
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
    console.log('Received search request:', {
      hasDescriptor: !!descriptor,
      filters
    });

    if (!descriptor || !Array.isArray(descriptor)) {
      return NextResponse.json(
        { message: 'Invalid face descriptor' },
        { status: 400 }
      );
    }

    try {
      // Connect to MongoDB
      await connect();
      console.log('MongoDB connected successfully');

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
      console.log('MongoDB query:', query);

      // Find models and calculate similarity scores
      const totalModels = await AdultModel
        .find(query)
        .countDocuments();
      
      console.log(`Total models matching query: ${totalModels}`);

      if (totalModels === 0) {
        return NextResponse.json(
          { message: 'No models found' },
          { status: 404 }
        );
      }

      // Process models in batches
      const allResults: SearchResult[] = [];
      const projection = 'name slug profile_image link age height weight cup_size nationality ethnicity hair_color eye_color tattoos piercings face_data';
      
      let processedModels = 0;
      for (let skip = 0; skip < totalModels; skip += BATCH_SIZE) {
        const batchModels = await AdultModel.find(query)
          .select(projection)
          .skip(skip)
          .limit(BATCH_SIZE)
          .lean<ModelDocument[]>();

        if (!Array.isArray(batchModels)) {
          console.error('Invalid batch results format');
          continue;
        }

        const validBatchModels = batchModels.filter((model): model is ModelDocument => {
          return model && typeof model === 'object' && model._id instanceof Types.ObjectId;
        });
        
        // First filter models with valid face data
        const modelsWithFaceData = validBatchModels
          .filter(model => {
            return model.face_data?.descriptor && 
                   Array.isArray(model.face_data.descriptor) && 
                   model.face_data.descriptor.length === descriptor.length;
          });

        // Then map to SearchResult type with null check
        const batchResults = modelsWithFaceData
          .map(model => {
            try {
              const faceDescriptor = model.face_data?.descriptor;
              if (!faceDescriptor) return null;
              
              const similarity = calculateSimilarity(descriptor, faceDescriptor);
              if (typeof similarity !== 'number' || similarity < MIN_CONFIDENCE) return null;

              const result: SearchResult = {
                id: model._id.toString(),
                name: model.name || 'Unknown',
                slug: model.slug || model.name?.toLowerCase().replace(/\s+/g, '-') || '',
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
                tats: model.tattoos?.has_tattoos === true ? 'yes' : 'no',
                piercings: model.piercings?.has_piercings === true ? 'yes' : 'no',
                confidence: similarity
              };
              return result;
            } catch (error) {
              console.error(`Error processing model ${model._id}:`, error);
              return null;
            }
          })
          .filter((result): result is SearchResult => {
            return result !== null && 
                   typeof result.confidence === 'number' && 
                   result.confidence >= MIN_CONFIDENCE;
          });

        allResults.push(...batchResults);
        processedModels += validBatchModels.length;

        // Early exit if we have enough good matches
        if (allResults.length >= 16) break;
      }

      // Sort by confidence and limit results
      const sortedResults = allResults
        .sort((a, b) => {
          const confidenceA = typeof a.confidence === 'number' ? a.confidence : 0;
          const confidenceB = typeof b.confidence === 'number' ? b.confidence : 0;
          return confidenceB - confidenceA;
        })
        .slice(0, 16);

      console.log(`Processed ${processedModels} models, returning ${sortedResults.length} results`);
      return NextResponse.json(sortedResults);

    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      console.error('Error details:', errorMessage);
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    } finally {
      console.log('Cleaning up search request');
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