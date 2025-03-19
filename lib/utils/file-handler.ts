'use client';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): FileValidationResult {

  if (!file) {
    return {
      isValid: false,
      error: 'Please select an image file'
    };
  }

  if (!VALID_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 5MB'
    };
  }

  return { isValid: true };
}

export async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file before processing
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    
    reader.onerror = () => {
      const error = reader.error?.message || 'Failed to read image file';
      reject(new Error(error));
    };
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      reader.abort();
      reject(new Error('File reading timed out'));
    }, 30000); // 30 second timeout

    reader.onloadend = () => {
      clearTimeout(timeout);
    };

    reader.readAsDataURL(file);
  });
}