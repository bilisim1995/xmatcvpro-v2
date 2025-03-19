import mongoose from 'mongoose';
import { Collection, MongoClient } from 'mongodb';
import { connect, disconnect } from './connection';

// Constants for similarity calculation
const MAX_DISTANCE = 0.6; // Daha sıkı mesafe eşiği
const COSINE_WEIGHT = 0.75; // Cosine similarity'e daha fazla ağırlık
const EUCLIDEAN_WEIGHT = 0.25; // Euclidean distance'a daha az ağırlık
const MIN_CONFIDENCE = 35; // Minimum benzerlik eşiği
const SIMILARITY_BOOST = 1.35; // Yüksek benzerlik için daha güçlü boost
const HIGH_SIMILARITY_THRESHOLD = 0.85; // Yüksek benzerlik eşiği
const PRECISION = 8; // Ondalık hassasiyeti

const COLLECTION_NAME = 'adultmodels';

let client: MongoClient;

export async function getCollection(collectionName: string): Promise<Collection> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!client) {
    client = await MongoClient.connect(process.env.MONGODB_URI);
  }

  const db = client.db(process.env.MONGODB_DB);
  return db.collection(collectionName);
}

// Model interface
interface IModel {
  _id: string;
  name: string;
  profile_image: string;
  link: string;
  slug?: string;
  age?: number;
  height?: {
    value: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  cup_size?: string;
  nationality?: string[];
  ethnicity?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: {
    has_tattoos: boolean;
    locations?: string[];
  };
  piercings?: {
    has_piercings: boolean;
    locations?: string[];
  };
  face_data?: {
    descriptor: number[];
    confidence?: number;
  };
  updated_at?: Date;
}

// Define schema
const modelSchema = new mongoose.Schema<IModel>({
  name: { type: String, required: true },
  slug: { type: String },
  profile_image: { type: String, required: true },
  link: { type: String, required: true },
  updated_at: { type: Date, default: Date.now },
  age: Number,
  height: {
    value: Number,
    unit: String
  },
  weight: {
    value: Number,
    unit: String
  },
  cup_size: String,
  nationality: [String],
  ethnicity: String,
  hair_color: String,
  eye_color: String,
  tattoos: {
    has_tattoos: Boolean,
    locations: [String]
  },
  piercings: {
    has_piercings: Boolean,
    locations: [String]
  },
  face_data: {
    descriptor: [Number],
    confidence: Number
  }
});

// Create model
export const AdultModel = mongoose.models.AdultModel || mongoose.model<IModel>('AdultModel', modelSchema, COLLECTION_NAME);

// Test connection
export async function testConnection() {
  try {
    await connect();
    const count = await AdultModel.countDocuments();
    return { 
      success: true, 
      message: `Successfully connected to MongoDB. Found ${count} models.` 
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to database'
    };
  } finally {
    await disconnect();
  }
}

export function calculateSimilarity(descriptor1: number[], descriptor2: number[]): number {
  // Sabitler
  if (!descriptor1?.length || !descriptor2?.length || descriptor1.length !== descriptor2.length) {
    console.warn("Descriptor boyutları eşleşmiyor!");
    return 0;
  }

  // Birebir aynı descriptor kontrolü
  const isIdentical = descriptor1.length === descriptor2.length && 
    descriptor1.every((val, i) => Math.abs(val - descriptor2[i]) < 1e-10);
  if (isIdentical) {
  
    return 100;
  }

  // 1. Cosine Similarity Hesaplama
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < descriptor1.length; i++) {
    // Hassasiyeti sınırla
    const d1 = Number(descriptor1[i].toFixed(PRECISION));
    const d2 = Number(descriptor2[i].toFixed(PRECISION));
    dotProduct += d1 * d2;
    norm1 += d1 * d1;
    norm2 += d2 * d2;
  }

  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);

  if (norm1 === 0 || norm2 === 0) {
    console.warn("⚠️ Boş vektör tespit edildi!");
    return 0;
  }

  const cosineSimilarity = dotProduct / (norm1 * norm2);
  const cosineScore = Math.max(0, cosineSimilarity); // Negatif değerleri sıfırla

  // 2. Euclidean Distance Hesaplama
  let euclideanDistance = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = Number(descriptor1[i].toFixed(PRECISION)) - Number(descriptor2[i].toFixed(PRECISION));
    euclideanDistance += diff * diff;
  }
  euclideanDistance = Math.sqrt(euclideanDistance);

  // 3. Normalize ve Boost Euclidean Score
  const normalizedEuclideanScore = Math.max(0, (1 - (euclideanDistance / MAX_DISTANCE)));

  // 4. Weighted Combination ve Boost
  const combinedScore = (cosineScore * COSINE_WEIGHT) + (normalizedEuclideanScore * EUCLIDEAN_WEIGHT);
  
  // 5. Yüksek skorları daha agresif boost et
  let boostedScore = combinedScore;
  if (combinedScore > HIGH_SIMILARITY_THRESHOLD) {
    boostedScore = Math.min(1, combinedScore * SIMILARITY_BOOST);
  } else if (combinedScore > 0.75) {
    // 0.75-0.85 arası için daha az boost
    const scaledBoost = 1 + ((combinedScore - 0.75) * (SIMILARITY_BOOST - 1));
    boostedScore = Math.min(1, combinedScore * scaledBoost);
  }
  
  // 6. Final skoru hesapla ve sınırla
  let finalPercent = Number((boostedScore * 100).toFixed(1));
  
  // 7. Yüksek skorlar arasındaki farkı vurgula
  if (finalPercent > 90) {
    // 90-100 arası skorları daha belirgin şekilde ayır
    const emphasis = Math.pow((finalPercent - 90) / 10, 1.5) * 10;
    finalPercent = Math.min(100, Number((90 + emphasis).toFixed(1)));
  }
  
  finalPercent = Math.min(100, Math.max(0, finalPercent)); // 0-100 arasına sınırla

 

  // Minimum güven skoru kontrolü
  return finalPercent >= MIN_CONFIDENCE ? finalPercent : 0;
}