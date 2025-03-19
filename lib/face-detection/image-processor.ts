'use client';

const MIN_IMAGE_SIZE = 150; // Minimum image size for face detection
const MAX_IMAGE_SIZE = 512; // Maksimum boyutu küçültelim
const JPEG_QUALITY = 0.8; // JPEG kalitesini optimize edelim

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function createImage(): HTMLImageElement {
  const img = document.createElement('img');
  img.crossOrigin = 'anonymous';
  return img;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = createImage();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function processImage(file: File): Promise<HTMLImageElement> {
  try {
    // Convert File to data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    // Create image from data URL
    const img = await loadImage(dataUrl);

    // Validate dimensions
    if (img.width < MIN_IMAGE_SIZE || img.height < MIN_IMAGE_SIZE) {
      throw new Error('Image is too small. Please use a larger image (at least 150x150 pixels).');
    }
    
    // Resize large images with error handling
    if (img.width > MAX_IMAGE_SIZE || img.height > MAX_IMAGE_SIZE) {
      const scale = MAX_IMAGE_SIZE / Math.max(img.width, img.height);
      // Ensure dimensions are valid
      const width = Math.max(MIN_IMAGE_SIZE, Math.floor(img.width * scale));
      const height = Math.max(MIN_IMAGE_SIZE, Math.floor(img.height * scale));
      const canvas = createCanvas(width, height);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Browser does not support image processing');
      }
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // WebP formatını destekleyen tarayıcılar için WebP kullanalım
      const format = 'webp' in ctx ? 'webp' : 'jpeg';
      
      try {
        const resizedImage = createImage();
        await new Promise((resolve, reject) => {
          resizedImage.onload = resolve;
          resizedImage.onerror = () => reject(new Error('Failed to process image'));
          resizedImage.src = canvas.toDataURL(`image/${format}`, JPEG_QUALITY);
        });
        return resizedImage;
      } catch (error) {
        throw new Error('Failed to process image. Please try a different photo.');
      }
    }

    return img;
  } catch (error) {
    console.error('Image processing error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to process image. Please try again with a different photo.');
  }
}