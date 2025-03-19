'use client';

import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SearchResult {
  id: string | number;
  name: string;
  image: string;
  confidence: number;
  link1?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!results.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <img 
            src={result.image} 
            alt={result.name}
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium">{result.name}</h3>
            <p className="text-sm text-muted-foreground">
              {result.confidence}% Eşleşme
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}