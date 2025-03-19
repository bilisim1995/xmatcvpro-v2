export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  cache: {
    revalidate: 3600 // 1 saat
  }
} as const;