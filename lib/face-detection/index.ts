import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;

  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
}

export async function detectFace(imageElement: HTMLImageElement): Promise<faceapi.FaceDetection | null> {
  try {
    await loadModels();
    const detection = await faceapi.detectSingleFace(imageElement);
    return detection || null;
  } catch (error) {
    console.error('Error detecting face:', error);
    return null;
  }
}

export async function getFaceDescriptor(imageElement: HTMLImageElement): Promise<Float32Array | null> {
  try {
    await loadModels();
    const detection = await faceapi
      .detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection?.descriptor || null;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    return null;
  }
}

export function calculateSimilarity(descriptor1: Float32Array, descriptor2: Float32Array): number {
  return 1 - faceapi.euclideanDistance(descriptor1, descriptor2);
}