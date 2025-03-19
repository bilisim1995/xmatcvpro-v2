import { useState, useCallback } from 'react';
import * as FaceDetection from '@/lib/face-detection';
import { getCollection } from '@/lib/mongodb/db';

interface MatchResult {
  id: string;
  name: string;
  image: string;
  confidence: number;
}

export function useFaceMatching() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMatches = useCallback(async (imageUrl: string): Promise<MatchResult[]> => {
    setIsProcessing(true);
    setError(null);

    try {
      const collection = await getCollection('adultmodels');
      const models = await collection.find().toArray();

      // For now, return mock results
      const validMatches: MatchResult[] = models.slice(0, 3).map(model => ({
        id: model._id.toString(),
        name: model.name,
        image: model.profile_image,
        confidence: 95
      }));

      return validMatches;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during face matching');
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    findMatches,
    isProcessing,
    error
  };
}