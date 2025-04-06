'use client';

import { useState } from 'react';
import { ModelFilters, SearchResult } from '@/lib/api/types';

export function useAdvancedSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (filters: ModelFilters = {}, randomResults?: SearchResult[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // If random results are provided, use them instead of fetching
      if (randomResults) {
        setResults(randomResults);
        return;
      }

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/models?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch results');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    isLoading,
    results,
    error
  };
}