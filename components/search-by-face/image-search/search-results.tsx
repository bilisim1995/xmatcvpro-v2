'use client';

import { Button } from '@/components/ui/button';
import { SearchSkeleton } from '../search-skeleton';
import { ShareModal } from '../share-modal';
import { Card } from '@/components/ui/card';
import { SearchResult } from '@/lib/api/types';
import { ModelCarousel } from '../model-carousel';
import { LoadingAnimation } from '../loading-animation';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, Images } from 'lucide-react';
import { useState } from 'react';
import { ResultCard } from './result-card';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchImage?: string | null;
  onSearchAgain: () => void;
}

export function SearchResults({ 
  results, 
  isLoading, 
  searchImage, 
  onSearchAgain 
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Sort results by confidence once and memoize
  const sortedResults = [...results].sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingAnimation />
        <SearchSkeleton />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.h2 
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
            >
              Search Results
            </motion.h2>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'carousel' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('carousel')}
                className={viewMode === 'carousel' ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:text-red-600'}
              >
                <Images className={`w-4 h-4 ${viewMode === 'carousel' ? 'text-white' : ''}`} />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:text-red-600'}
              >
                <LayoutGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : ''}`} />
              </Button>
            </div>
          </div>
        </motion.div>
        
        {viewMode === 'carousel' ? (
          <ModelCarousel results={sortedResults} showConfidence />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedResults.map((result, index) => (
              <ResultCard
                key={result.id}
                result={result}
                index={index}
                showConfidence
              />
            ))}
          </div>
        )}
      </Card>
      
      {/* Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={onSearchAgain}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Again
        </Button>
        {searchImage && <ShareModal searchImage={searchImage} results={results} />}
      </div>
    </div>
  );
}