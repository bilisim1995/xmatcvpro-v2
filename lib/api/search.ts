'use client';

import * as faceapi from 'face-api.js';

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error('Failed to load face detection models:', error);
    throw new Error('Failed to initialize face detection');
  }
}

export async function searchByImage(imageUrl: string) {
  try {
    await loadModels();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
    
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in the image');
    }

    // Get models from our API
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descriptor: Array.from(detection.descriptor),
        threshold: 0.6
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const models = await response.json();

    // Process face matching locally
    const results = await Promise.all(
      models.map(async (model: any) => {
        try {
          const modelImg = new Image();
          modelImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            modelImg.onload = resolve;
            modelImg.onerror = reject;
            modelImg.src = model.image;
          });

          const modelDetection = await faceapi
            .detectSingleFace(modelImg)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!modelDetection) return null;

          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            modelDetection.descriptor
          );

          const similarity = Math.max(0, Math.min(100, (1 - distance) * 100));
          
          if (similarity < 60) return null;

          return {
            ...model,
            confidence: Math.round(similarity)
          };
        } catch (error) {
          console.warn(`Failed to process model ${model.name}:`, error);
          return null;
        }
      })
    );

    const validResults = results
      .filter(result => result !== null)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    if (validResults.length === 0) {
      throw new Error('No matching models found');
    }

    return validResults;

  } catch (error) {
    console.error('Search error:', error);
    throw error instanceof Error ? error : new Error('Search failed');
  }
}