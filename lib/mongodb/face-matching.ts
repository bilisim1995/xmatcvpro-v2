import { Types } from 'mongoose';
import { getCollection } from './db';
import { SearchResult } from '@/lib/api/types';
import * as faceapi from 'face-api.js';

const COLLECTIONS = {
  MODELS: 'adultmodels',
  FACE_DESCRIPTORS: 'face_descriptors'
} as const;

// Yüz özellik vektörünü kaydet
export async function saveFaceDescriptor(
  modelId: string,
  descriptor: number[],
  landmarks?: number[],
  confidence: number = 1.0
): Promise<boolean> {
  try {
    const collection = await getCollection(COLLECTIONS.FACE_DESCRIPTORS);
    
    await collection.updateOne(
      { model_id: modelId },
      {
        $set: {
          model_id: modelId,
          descriptor: descriptor,
          landmarks: landmarks,
          confidence: confidence,
          updated_at: new Date()
        },
        $setOnInsert: {
          created_at: new Date()
        }
      },
      { upsert: true }
    );

    // Ana model dokümanını da güncelle
    const modelsCollection = await getCollection(COLLECTIONS.MODELS);
    await modelsCollection.updateOne(
      { _id: new Types.ObjectId(modelId) },
      {
        $set: {
          face_descriptor: descriptor,
          face_landmarks: landmarks,
          face_confidence: confidence,
          face_updated_at: new Date()
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Failed to save face descriptor:', error);
    return false;
  }
}

// Benzerlik hesaplama fonksiyonu
function calculateSimilarity(descriptor1: number[], descriptor2: number[]): number {
  if (descriptor1.length !== descriptor2.length) {
    throw new Error('Descriptor lengths do not match');
  }

  // Euclidean distance hesaplama
  const sum = descriptor1.reduce((acc, val, i) => {
    return acc + Math.pow(val - descriptor2[i], 2);
  }, 0);
  const distance = Math.sqrt(sum);

  // Benzerlik skoru (0-100 arası)
  return Math.max(0, Math.min(100, (1 - distance) * 100));
}

// Benzer yüzleri bul
export async function findSimilarFaces(
  descriptor: number[],
  limit: number = 3,
  threshold: number = 0.6
): Promise<SearchResult[]> {
  try {
    const collection = await getCollection(COLLECTIONS.FACE_DESCRIPTORS);
    
    // MongoDB aggregation pipeline
    const pipeline = [
      // Her kayıt için benzerlik hesapla
      {
        $addFields: {
          similarity: {
            $function: {
              body: function(a: number[], b: number[]) {
                return calculateSimilarity(a, b);
              },
              args: ["$descriptor", descriptor],
              lang: "js"
            }
          }
        }
      },
      // Threshold üzerindeki sonuçları filtrele
      { 
        $match: { 
          similarity: { $gt: threshold * 100 } 
        }
      },
      // Benzerliğe göre sırala
      { 
        $sort: { 
          similarity: -1 
        }
      },
      // Limit uygula
      { 
        $limit: limit 
      },
      // Model bilgilerini join ile al
      {
        $lookup: {
          from: COLLECTIONS.MODELS,
          localField: "model_id",
          foreignField: "_id",
          as: "model"
        }
      },
      // Array'i düzleştir
      { 
        $unwind: "$model" 
      },
      // Sonuç formatını ayarla
      {
        $project: {
          id: "$model._id",
          name: "$model.name",
          image: "$model.profile_image",
          link1: "$model.link",
          confidence: "$similarity",
          height: "$model.height.value",
          age: "$model.age",
          nationality: { $arrayElemAt: ["$model.nationality", 0] },
          ethnicity: "$model.ethnicity",
          cup_size: "$model.cup_size",
          hair: "$model.hair_color",
          eyes: "$model.eye_color",
          tats: { $cond: ["$model.tattoos.has_tattoos", "yes", "no"] },
          piercings: { $cond: ["$model.piercings.has_piercings", "yes", "no"] }
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results as SearchResult[];
  } catch (error) {
    console.error('Failed to find similar faces:', error);
    throw error;
  }
}

// Yüz özellik vektörlerini toplu güncelle
export async function batchUpdateFaceDescriptors(
  models: SearchResult[],
  batchSize: number = 10
): Promise<void> {
  try {
    for (let i = 0; i < models.length; i += batchSize) {
      const batch = models.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (model) => {
        try {
          // Resmi yükle
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = model.image;
          });

          // Yüz tespiti ve özellik çıkarımı
          const detection = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            await saveFaceDescriptor(
              model.id.toString(),
              Array.from(detection.descriptor),
              detection.landmarks.positions.map(p => [p.x, p.y]).flat(),
              1.0
            );
          }
        } catch (error) {
          console.warn(`Failed to process model ${model.name}:`, error);
        }
      }));

      // Rate limiting için bekle
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Batch update failed:', error);
    throw error;
  }
}