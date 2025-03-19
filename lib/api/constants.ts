export const API_URL = 'https://dev.xmatch.pro/public/api';

export const API_ENDPOINTS = {
  MODELS: {
    BY_SLUG: (slug: string) => `${API_URL}/models/${slug}`,
    SEARCH: `${API_URL}/search`,
    LIST: `${API_URL}/models`
  }
} as const;

export const API_TIMEOUT = 10000; // 10 seconds