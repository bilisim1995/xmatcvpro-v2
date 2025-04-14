'use client';

import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchSkeleton } from './search-skeleton';
import { ResultCard } from './image-search/result-card';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface ImageSearchResultsProps {
  results: any[];
  isLoading: boolean;
  onSearchAgain: () => void;
}

export function ImageSearchResults({ results, isLoading, onSearchAgain }: ImageSearchResultsProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center py-8">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-4" />
          <p className="text-muted-foreground">{t('imagesearchresults.analyzing')}</p>
        </div>
        <SearchSkeleton />
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((result, index) => (
          <ResultCard key={result.id} result={result} index={index} />
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onSearchAgain}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8"
        >
          <Search className="w-4 h-4 mr-2" />
          {t('imagesearchresults.search_again')}
        </Button>
      </div>
    </div>
  );
}