'use client';

const IMAGE_TIMEOUT = 10000; // 10 second timeout

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const timer = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, IMAGE_TIMEOUT);
    
    img.onload = () => {
      clearTimeout(timer);
      if (img.width === 0 || img.height === 0) {
        reject(new Error('Invalid image dimensions'));
        return;
      }
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
}

export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    console.warn('Invalid image type:', file.type);
    return false;
  }
  
  if (file.size > maxSize) {
    console.warn('File too large:', file.size);
    return false;
  }
  
  return true;
}