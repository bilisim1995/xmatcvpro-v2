'use client';

import { SearchResponse, SearchError } from './types';

export async function searchApi(descriptor: Float32Array): Promise<SearchResponse[]> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        descriptor: Array.from(descriptor),
        threshold: 0.6
      })
    });

    if (!response.ok) {
      const error = await response.json() as SearchError;
      throw new Error(error.message || `Search failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('API Error:', error);
    throw error instanceof Error ? error : new Error('Failed to connect to search service');
  }
}