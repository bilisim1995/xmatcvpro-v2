'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ResultCard } from '../image-search/result-card';
import { SearchResult } from '@/lib/api/types'; 
import { Card } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

interface ModelCarouselProps {
  results: SearchResult[];
  showConfidence?: boolean;
}

interface AdSlot {
  type: 'ad';
  id: number;
}

function AdCard({ index }: { index: number }) {
  return (
    <Card className="h-full w-full aspect-[3/4] flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-lg border p-4">
      
      {/* Üst içerik ortalanmış */}
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Megaphone className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Advertisement</h3>
        <p className="text-sm text-muted-foreground">Promoted content</p>
      </div>

      {/* Alt içerik */}
      <div className="flex justify-center pt-4">
        <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white font-bold">
          R{index}
        </div>
      </div>

    </Card>
  );
}





export function ModelCarousel({ results, showConfidence = true }: ModelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  
  // Sort results by confidence score
  const sortedResults = [...results].sort((a, b) => {
    const confidenceDiff = (b.confidence || 0) - (a.confidence || 0);
    return confidenceDiff;
  }).slice(0, 15); // Limit to 15 results

  // Insert ad slots after every 3 models
  const resultsWithAds: (SearchResult | AdSlot)[] = [];
  let adCounter = 1;
  
  sortedResults.forEach((result, index) => {
    resultsWithAds.push(result);
    if ((index + 1) % 3 === 0) {
      resultsWithAds.push({ type: 'ad', id: adCounter++ });
    }
  });

  const totalPages = Math.ceil(resultsWithAds.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Fill empty slots to maintain grid
  const displayResults = [...resultsWithAds.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  ),
    ...Array(Math.max(0, itemsPerPage - resultsWithAds.length)).fill(null)
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
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch" // 🟢 Buraya items-stretch EKLENDİ!
>
  {displayResults.map((item, idx) => (
    <motion.div
      key={`${item?.type === 'ad' ? `ad-${(item as AdSlot).id}` : `model-${(item as SearchResult)?.id}`}-${idx}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="h-full w-full" // 🟢 Buraya h-full w-full EKLENDİ!
    >
      {item ? (
        item.type === 'ad' ? (
          <AdCard index={(item as AdSlot).id} />
        ) : (
          <ResultCard
            result={item as SearchResult}
            index={currentIndex * itemsPerPage + idx - Math.floor((currentIndex * itemsPerPage + idx) / 4)}
            showConfidence={showConfidence}
          />
        )
      ) : (
        <div className="aspect-[3/4] bg-muted/10 rounded-lg h-full w-full" />
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