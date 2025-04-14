'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SearchSkeleton } from '../search-skeleton';
import { ShareModal } from '../share-modal';
import { SearchResult } from '@/lib/api/types';
import { ModelCarousel } from '../model-carousel';
import { LoadingAnimation } from '../loading-animation';
import { motion } from 'framer-motion';
import { Search, LayoutGrid, Images, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { ResultCard } from './result-card';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface AdSlot {
  type: 'ad';
  id: string | number;
}

function AdCard({ index }: { index: string | number }) {
  return (
    <Card className="h-full w-full aspect-[3/4] flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-lg border p-4">
      <div className="flex flex-col items-center justify-center flex-grow px-4 pt-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Megaphone className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Advertisement</h3>
        <p className="text-sm text-muted-foreground">Promoted content</p>
      </div>

      <div className="flex justify-center pb-4">
        <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white font-bold">
          {`R${index}`}
        </div>
      </div>
    </Card>
  );
}

type ResultItem = SearchResult | AdSlot;

interface SearchResultsProps { 
  results: SearchResult[];
  isLoading: boolean;
  searchImage?: string | null;
  onSearchAgain: () => void;
}

function isAdSlot(item: ResultItem): item is AdSlot {
  return 'type' in item && item.type === 'ad';
}

export function SearchResults({ 
  results, 
  isLoading, 
  searchImage, 
  onSearchAgain 
}: SearchResultsProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  
  // Sort results and limit to 15
  const sortedResults = [...results]
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 15);

  // Insert ad slots after every 3 models
  const resultsWithAds: ResultItem[] = [];
  let adCounter = 1;

  sortedResults.forEach((result, index) => {
    resultsWithAds.push(result);
    if ((index + 1) % 3 === 0) {
      resultsWithAds.push({ type: 'ad', id: `${adCounter++}` });
    }
  });

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
              {t('searchresults.search_results')}
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
            {resultsWithAds.map((item, idx) => (
              isAdSlot(item) ? (
                <AdCard key={`${item.id}`} index={item.id} />
              ) : (
                <ResultCard
                  key={item.id}
                  result={item}
                  index={idx - Math.floor(idx / 4)}
                  showConfidence
                />
              )
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
          {t('searchresults.search_again')}
        </Button>
        {searchImage && <ShareModal searchImage={searchImage} results={results} />}
      </div>
    </div>
  );
}