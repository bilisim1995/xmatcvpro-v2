'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResultCard } from '../image-search/result-card';
import { SearchResult } from '@/lib/api/types'; 
import Link from 'next/link';

interface ModelCarouselProps {
  results: SearchResult[];
  showConfidence?: boolean;
}

export function ModelCarousel({ results, showConfidence = true }: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  // Sonuçları benzerlik skoruna göre sırala
  const sortedResults = [...results].sort((a, b) => {
    // Önce confidence skoruna göre sırala (yüksekten düşüğe)
    const confidenceDiff = (b.confidence || 0) - (a.confidence || 0);
    return confidenceDiff;
  });

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };



  // Fill empty slots to maintain grid

  const displayResults = [
    ...results.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage),
    ...Array(Math.max(0, itemsPerPage - results.length)).fill(null)
  ];

  return (
    <div className="relative group min-h-[400px]">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse"
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Results Grid */}
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
                key={`${result?.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {result?.name ? (
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

      {/* Pagination Dots */}
      {totalPages > 1 && results.length > 4 && (
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