import mongoose from 'mongoose';
import { Collection, MongoClient } from 'mongodb';
import { connect, disconnect } from './connection';

// Constants for similarity calculation
const MIN_CONFIDENCE = 35; // Minimum benzerlik eşiği
const HIGH_SIMILARITY_THRESHOLD = 0.85; // Yüksek benzerlik eşiği
const EARLY_EXIT_COSINE_THRESHOLD = 0.3; // Early exit için minimum cosine similarity
const BOOST_FACTOR = 2; // Boost katsayısı (daha yumuşak)

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

// 🔥 SIMILARITY CALCULATION - İYİLEŞTİRİLMİŞ VERSİYON 🔥
export function calculateSimilarity(descriptor1: number[], descriptor2: number[]): number {
  // Validation
  if (!descriptor1?.length || !descriptor2?.length || descriptor1.length !== descriptor2.length) {
    console.warn("❌ Descriptor boyutları eşleşmiyor!");
    return 0;
  }

  if (descriptor1.some(isNaN) || descriptor2.some(isNaN)) {
    console.warn("❌ NaN değer tespit edildi!");
    return 0;
  }

  const descriptorLength = descriptor1.length;
  
  // Calculate cosine similarity (no rounding for precision)
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  let euclideanDistance = 0;

  for (let i = 0; i < descriptorLength; i++) {
    const d1 = descriptor1[i];
    const d2 = descriptor2[i];
    dotProduct += d1 * d2;
    norm1 += d1 * d1;
    norm2 += d2 * d2;
    const diff = d1 - d2;
    euclideanDistance += diff * diff;
  }

  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);
  
  if (norm1 === 0 || norm2 === 0) {
    console.warn("⚠️ Boş vektör tespit edildi!");
    return 0;
  }

  const cosineSimilarity = dotProduct / (norm1 * norm2);
  
  // Early exit for very low similarity (performance optimization)
  if (cosineSimilarity < EARLY_EXIT_COSINE_THRESHOLD) {
    return 0;
  }

  // Normalize cosine to 0-1 range
  const cosineScore = (cosineSimilarity + 1) / 2;

  // Dynamic MAX_DISTANCE based on descriptor length
  // For 128-dimensional descriptors: sqrt(128) * 0.05 ≈ 0.57
  const MAX_DISTANCE = Math.sqrt(descriptorLength) * 0.05;
  
  // Calculate normalized euclidean score
  euclideanDistance = Math.sqrt(euclideanDistance);
  const normalizedEuclideanScore = Math.max(0, Math.min(1, 1 - (euclideanDistance / MAX_DISTANCE)));

  // Adaptive weight calculation (smoother transition)
  // Cosine weight ranges from 0.7 to 0.9 based on cosine score
  const cosineWeight = 0.7 + (cosineScore * 0.2);
  const euclideanWeight = 1 - cosineWeight;

  // Combined score
  const combinedScore = (cosineScore * cosineWeight) + (normalizedEuclideanScore * euclideanWeight);

  // Softer boost for high similarity
  let boostedScore = combinedScore;
  if (combinedScore > HIGH_SIMILARITY_THRESHOLD) {
    const boostFactor = 1 + ((combinedScore - HIGH_SIMILARITY_THRESHOLD) * BOOST_FACTOR);
    boostedScore = Math.min(1, combinedScore * boostFactor);
  }

  // Convert to percentage (no additional emphasis needed - boost is sufficient)
  let finalPercent = Number((boostedScore * 100).toFixed(1));

  // Apply minimum threshold
  const dynamicMinConfidence = HIGH_SIMILARITY_THRESHOLD * 100 * 0.4;
  const minThreshold = Math.max(MIN_CONFIDENCE, dynamicMinConfidence);
  
  // Clamp to valid range
  finalPercent = Math.min(100, Math.max(0, finalPercent));

  return finalPercent >= minThreshold ? finalPercent : 0;
}