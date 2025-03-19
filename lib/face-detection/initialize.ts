'use client';

import * as faceapi from 'face-api.js';

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;
let initializationAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;


export async function loadModels(): Promise<void> {
  try {
  

    // Load models sequentially to avoid memory issues
    if (!faceapi.nets.tinyFaceDetector.isLoaded) {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

    }

    if (!faceapi.nets.faceLandmark68Net.isLoaded) {
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
     
    }

    if (!faceapi.nets.faceRecognitionNet.isLoaded) {
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
   
    }

   
    isInitialized = true;
  } catch (error) {
    console.error('❌ Failed to load models:', error);
    throw new Error('Failed to initialize face detection. Please refresh and try again.');
  }
}

export async function initializeFaceApi(forceReload = false): Promise<void> {
  if (typeof window === 'undefined') {
   
    return;
  }

  if (isInitialized && !forceReload) return;
  if (initializationPromise) return initializationPromise;

  if (forceReload) {
    isInitialized = false;
    initializationAttempts = 0;
  }

  initializationPromise = (async () => {
    try {
      await Promise.race([
        loadModels(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Model loading timeout')), 30000)
        )
      ]);

      isInitialized = true;
     

    } catch (error) {
      isInitialized = false;
      initializationPromise = null;
      initializationAttempts++;
      
      if (initializationAttempts < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return initializeFaceApi(forceReload);
      }
      
      console.error('Failed to load face detection models:', error);
      throw new Error('Failed to initialize face detection. Please refresh and try again.');
    }
  })();

  return initializationPromise;
}

export async function detectFace(img: HTMLImageElement) {
  if (typeof window === 'undefined') return null;
  
  await initializeFaceApi();

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error('❌ No face detected in image');
  }

  return detection;
}