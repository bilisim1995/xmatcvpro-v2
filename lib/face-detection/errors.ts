export class FaceDetectionError extends Error {
  constructor(
    message: string,
    public code: 'INITIALIZATION_FAILED' | 'NO_FACE_DETECTED' | 'API_ERROR' | 'PROCESSING_ERROR' | 'NO_MATCHES'
  ) {
    super(message);
    this.name = 'FaceDetectionError';
  }
}

export const createFaceDetectionError = (code: FaceDetectionError['code'], message?: string): FaceDetectionError => {
  const defaultMessages = {
    INITIALIZATION_FAILED: 'Failed to load face detection models. Please refresh and try again.',
    NO_FACE_DETECTED: 'No face detected in the image',
    API_ERROR: 'Failed to fetch model data',
    PROCESSING_ERROR: 'Error processing image',
    NO_MATCHES: 'No matching faces found'
  };

  return new FaceDetectionError(message || defaultMessages[code], code);
};