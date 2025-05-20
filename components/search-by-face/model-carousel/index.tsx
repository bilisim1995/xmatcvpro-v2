'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResultCard } from '../image-search/result-card';
import { SearchResult } from '@/lib/api/types'; 
import { Card } from '@/components/ui/card';
import Image from 'next/image'; 
import { useLanguage } from '@/components/contexts/LanguageContext'; 

interface AdSlot {
  type: 'ad';
  id: string | number;
  imageUrl: string;
}

type ResultItem = SearchResult | AdSlot;

interface ModelCarouselProps {
  results: ResultItem[]; 
  showConfidence?: boolean;
}

function AdCard({ ad }: { ad: AdSlot }) { 
  const { t } = useLanguage();
  return (
    <Card className="h-full w-full aspect-[3/4] flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-lg border">
      <a href={`#ad-${ad.id}`} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full bg-muted/10">
        <Image
          src={ad.imageUrl}
          alt={`${t('searchresults.advertisement')} ${ad.id}`} // Removed fallback text
          layout="fill"
          objectFit="contain"
          className="group-hover:scale-105 transition-transform duration-300"
          unoptimized={true} // Keep for SVG troubleshooting
          onError={(e) => {
            console.error(`Error loading AdCard image (SVG) in ModelCarousel: ${ad.imageUrl}`, e);
            e.currentTarget.src = 'https://via.placeholder.com/300x400.png?text=Ad+SVG+Error';
            e.currentTarget.srcset = '';
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {`R${ad.id}`}
        </div>
      </a>
    </Card>
  );
}

function isAdSlot(item: ResultItem | null): item is AdSlot { // Allow null for item
  return item !== null && typeof item === 'object' && 'type' in item && item.type === 'ad';
}

export function ModelCarousel({ results, showConfidence = true }: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; 
  
  const displayableItems = results; 
  // console.log("[ModelCarousel] Received results (displayableItems):", displayableItems);

  const totalPages = Math.ceil(displayableItems.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentPageItems = displayableItems.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );
  // console.log("[ModelCarousel] Current page items for carousel:", currentPageItems);
  
  const displayResultsInPage = [
    ...currentPageItems,
    ...Array(Math.max(0, itemsPerPage - currentPageItems.length)).fill(null)
  ];
  
  if (!results || results.length === 0) {
    return <div className="text-center text-muted-foreground">No models to display in carousel.</div>;
  }

  return (
    <div className="relative group min-h-[400px]">
      {totalPages > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={nextSlide}
            disabled={currentIndex >= totalPages - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      <div className="overflow-hidden px-2">
        <AnimatePresence mode="wait">
         <motion.div
            key={currentIndex} 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          >
            {displayResultsInPage.map((item, idx) => {
              // console.log(`[ModelCarousel] Mapping item ${idx}:`, item);
              return (
                <motion.div
                  key={item ? (isAdSlot(item) ? `ad-${item.id}-${currentIndex}-${idx}` : `model-${(item as SearchResult).id}-${currentIndex}-${idx}`) : `empty-${currentIndex}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full w-full"
                >
                  {item ? (
                    isAdSlot(item) ? (
                      <AdCard ad={item} />
                    ) : (
                      <ResultCard
                        result={item as SearchResult} 
                        index={idx} // Simplified index to current page index
                        showConfidence={showConfidence}
                      />
                    )
                  ) : (
                    <div className="aspect-[3/4] bg-muted/10 rounded-lg h-full w-full" /> 
                  )}
                </motion.div>
              );
            })}
         </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && displayableItems.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <motion.button
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-red-600 w-4'
                    : 'bg-red-200 dark:bg-red-800 w-2 hover:bg-red-300 dark:hover:bg-red-700'
                }`}
                onClick={() => setCurrentIndex(idx)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                } : undefined}
                transition={isActive ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
