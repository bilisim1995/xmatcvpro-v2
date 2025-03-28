'use client';

import * as faceapi from 'face-api.js';

interface DetectionResult {
  gender: 'male' | 'female' | null;
  age: number | null;
}

let isModelLoaded = false;
let modelLoadingPromise: Promise<void> | null = null;

async function loadModels() {
  if (isModelLoaded) return;
  
  // Return existing promise if models are already loading
  if (modelLoadingPromise) return modelLoadingPromise;

  try {
    modelLoadingPromise = Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models')
    ]).then(() => {
      isModelLoaded = true;
      modelLoadingPromise = null;
    });

    await modelLoadingPromise;
  } catch (error) {
    modelLoadingPromise = null;
    isModelLoaded = false;
    console.error('Failed to load face detection models:', error);
    throw new Error('Failed to initialize face detection');
  }
}

export async function detectGenderAndAge(imageElement: HTMLImageElement): Promise<DetectionResult> {
  try {
    // Ensure models are loaded before detection
    await loadModels();

    // Create detection options with higher confidence threshold
    const options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5,
      maxResults: 1
    });

    // Detect face with gender detection
    const detection = await faceapi
      .detectSingleFace(imageElement, options)
      .withFaceLandmarks()
      .withAgeAndGender();

    if (!detection) {
     
      return { gender: null, age: null };
    }

    // Return gender based on probability threshold
    const genderProbability = detection.genderProbability;
    const isMale = detection.gender === 'male' && genderProbability > 0.7;
    const age = Math.round(detection.age);
    
    return {
      gender: isMale ? 'male' : 'female',
      age: age
    };

  } catch (error) {
    console.error('Gender detection error:', error);
    return { gender: null, age: null };
  }
}