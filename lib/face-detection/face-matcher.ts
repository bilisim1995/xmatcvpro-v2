'use client';

import * as faceapi from 'face-api.js';
import { initializeFaceApi } from './initialize';
import { SearchResult } from '@/lib/api/types';

// Constants
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;
const CLEANUP_DELAY = 100;

export async function findMatches(imageFile: File): Promise<SearchResult[]> {
  let imageElement: HTMLImageElement | null = null;
  let retryCount = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let controller: AbortController | null = null;

  try {
    // Initialize face-api if not already initialized
    await initializeFaceApi();

    while (retryCount <= MAX_RETRIES) {
      try {
        imageElement = await createImageFromFile(imageFile);
    
        // Detect face and get descriptor
        const detection = await faceapi
          .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          throw new Error('No face detected in the image. Please try a clearer photo.');
        }

        controller = new AbortController();
        timeoutId = setTimeout(() => controller?.abort(), API_TIMEOUT);

        const response = await fetch('/api/search', {  // Endpoint doğru, değiştirmeye gerek yok
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            descriptor: Array.from(detection.descriptor).map(x => Number(x.toFixed(8))), // Hassasiyeti sınırla
            filters: {} // Add empty filters object for API compatibility
          })
        });

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          if (response.status === 429 && retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            retryCount++;
            continue;
          }
          if (response.status === 404) {
            throw new Error('No matches found. Please try another photo.');
          }
          throw new Error(error.message || 'Failed to connect to search service');
        }

        const matches = await response.json();
        if (!Array.isArray(matches)) {
          throw new Error('Invalid response format');
        }

        // Benzerlik skorlarını normalize et
        const normalizedMatches = matches.map(match => ({
          ...match,
          confidence: Math.min(100, Number(match.confidence.toFixed(1)))
        }));

        // Skorları sırala ve en iyi 16 sonucu döndür
        const sortedMatches = normalizedMatches
          .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
          .slice(0, 16);

        if (!matches.length) {
          throw new Error('No matching models found. Please try another photo.');
        }
        
        return sortedMatches;
      } catch (error) {
        if (retryCount >= MAX_RETRIES) throw error;
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
      continue;
    }
    throw new Error('Failed to process image after maximum retries');

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process image. Please try again later.');
  } finally {
    // Cleanup
    if (imageElement?.src) {
      URL.revokeObjectURL(imageElement.src);
    }
    // Clean up timeouts and controllers
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (controller) {
      controller.abort();
    }
    // Allow time for cleanup
    await new Promise(resolve => setTimeout(resolve, CLEANUP_DELAY));
  }
}

async function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
}