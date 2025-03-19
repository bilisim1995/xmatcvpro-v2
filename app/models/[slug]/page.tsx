'use client';

import { useEffect, useState } from 'react';
import { ModelDetailPage } from '@/components/search-by-face/model-detail/page';
import { SearchResult } from '@/lib/api/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  const [model, setModel] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setIsLoading(true);
        
        // Clean and normalize the slug
        const cleanSlug = params.slug
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, '')
          .replace(/\s+/g, '-');

        const response = await fetch(`/api/models/${cleanSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch model');
        }

        const data = await response.json();
        setModel(data);
      } catch (error) {
        console.error('Error fetching model:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-muted rounded-lg mb-8" />
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!model) {
    notFound();
  }

  return <ModelDetailPage model={model} />;
}