export interface MatchResult {
  id: string;
  name: string;
  image: string;
  confidence: number;
}

export interface Model {
  id: string;
  name: string;
  profile_image: string;
}

export interface FaceDetectionError extends Error {
  code: 'INITIALIZATION_FAILED' | 'NO_FACE_DETECTED' | 'API_ERROR' | 'PROCESSING_ERROR';
}