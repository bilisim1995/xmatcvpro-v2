'use client';

import { useState, useEffect } from 'react';
import { TopListSite } from '@/lib/mongodb/toplist';

export function useTopListSites(categoryId: string | null) {
  const [sites, setSites] = useState<TopListSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = categoryId 
          ? `/api/toplist/sites?category_id=${categoryId}`
          : '/api/toplist/sites';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch sites');
        }

        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error('Error fetching sites:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch sites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, [categoryId]);

  return { sites, isLoading, error };
}