'use client';

const PROXY_URL = 'https://cors.xmatch.pro/proxy?url=';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-placeholder.jpg';

export async function fetchWithProxy(url: string, retries = 3): Promise<Response> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'image/*',
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        },
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Verify we got an image
      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error('Invalid content type');
      }

      return response;

    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between retries
    }
  }

  console.warn(`Failed to fetch image after ${retries} retries:`, url);
  throw lastError;
}

export async function getImageAsBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;

  try {
    const response = await fetchWithProxy(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Failed to load image, using fallback:', url);
    return FALLBACK_IMAGE;
  }
}