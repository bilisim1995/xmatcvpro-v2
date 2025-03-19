'use client';

import { getImageAsBase64 } from './proxy';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function loadImageWithRetry(url: string, retries = MAX_RETRIES): Promise<string> {
  try {
    return await getImageAsBase64(url);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return loadImageWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function preloadImage(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = dataUrl;
  });
}