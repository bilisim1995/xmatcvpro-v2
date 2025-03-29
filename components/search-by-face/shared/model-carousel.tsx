'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResultCard } from '../image-search/result-card';
import { SearchResult } from '@/lib/api/types';
import { Megaphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

interface ModelCarouselProps {
  results: SearchResult[];
  showConfidence?: boolean;
}

export function ModelCarousel({ results, showConfidence = true }: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  
  // Process results to include ads
  const processedResults = results.slice(0, 15).reduce<(SearchResult | AdSlot)[]>((acc, result, index) => {
    acc.push(result);
    if ((index + 1) % 3 === 0 && index < 14) { // Add ad after every 3rd item
      acc.push({ type: 'ad', id: Math.floor(index / 3) + 1 });
    }
    // Add R5 at the end if we have all 15 results
    if (index === 14) {
      acc.push({ type: 'ad', id: 5 });
    }
    return acc;
  }, []);

  const totalPages = Math.ceil(processedResults.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const displayResults = [...processedResults.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  ),
    ...Array(Math.max(0, itemsPerPage - processedResults.length)).fill(null)
  ];

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
            disabled={currentIndex === totalPages - 1}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayResults.map((result, idx) => (
              <motion.div
                key={result?.id || `empty-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {result ? (
                  'type' in result ? (
                    <AdCard key={`ad-${result.id}`} index={result.id} />
                  ) : (
                    <ResultCard
                      result={result}
                      index={currentIndex * itemsPerPage + idx - Math.floor((currentIndex * itemsPerPage + idx) / 4)}
                      showConfidence={showConfidence}
                    />
                  )
                ) : (
                  <div className="aspect-[3/4] bg-muted/10 rounded-lg" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, idx) => (
            <motion.button
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-red-600 w-4'
                  : 'bg-red-200 dark:bg-red-800 w-2 hover:bg-red-300 dark:hover:bg-red-700'
              }`}
              onClick={() => setCurrentIndex(idx)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}