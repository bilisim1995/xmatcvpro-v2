'use client';

import { useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { SearchResult } from '@/lib/api/types';
import { loadImage } from '@/lib/utils/image';
import { getImageAsBase64 } from '@/lib/utils/proxy';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export function useFaceDetection() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const findMatches = useCallback(async (imageUrl: string): Promise<SearchResult[]> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Process source image
      const sourceImg = await loadImage(imageUrl);
      
      // Detect face in source image
      const detection = await faceapi
        .detectSingleFace(sourceImg, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No face detected in the uploaded image');
      }

      // Send descriptor to API
      const response = await fetch('/api/face-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descriptor: Array.from(detection.descriptor),
          imageUrl
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search for matches');
      }

      const matches = await response.json();
      
      if (!matches.length) {
        throw new Error('No faces found in database');
      }

      return matches.slice(0, 3);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { findMatches, error, isProcessing };
}