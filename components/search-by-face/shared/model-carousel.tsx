'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResultCard } from '../image-search/result-card';
import { SearchResult } from '@/lib/api/types';

interface ModelCarouselProps {
  results: SearchResult[];
  showConfidence?: boolean;
}

export function ModelCarousel({ results, showConfidence = true }: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  
  // Sort results by confidence score
  const sortedResults = [...results].sort((a, b) => {
    const confidenceDiff = (b.confidence || 0) - (a.confidence || 0);
    if (confidenceDiff === 0) {
      return a.name.localeCompare(b.name);
    }
    return confidenceDiff;
  });

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const displayResults = [
    ...sortedResults.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage),
    ...Array(Math.max(0, itemsPerPage - sortedResults.length)).fill(null)
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
                  <ResultCard
                    result={result}
                    index={currentIndex * itemsPerPage + idx}
                    showConfidence={showConfidence}
                  />
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