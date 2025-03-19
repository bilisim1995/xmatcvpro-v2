'use server';

import { API_TIMEOUT } from './constants';
import { ApiError, ModelNotFoundError } from './errors';

interface FetchOptions extends RequestInit {
  timeout?: number;
  next?: NextFetchRequestConfig;
}

export async function fetchApi<T>(url: string, options: FetchOptions = {}): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || API_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ModelNotFoundError('Model not found');
      }
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data.data || data;

  } catch (error) {
    if (error instanceof ModelNotFoundError || error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out');
    }

    throw new ApiError('Failed to fetch data');
  }
}