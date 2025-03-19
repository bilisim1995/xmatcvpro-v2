'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TopFilters } from '../advanced-search/filters/top-filters';
import { SideFilters } from '../advanced-search/filters/side-filters';
import { ModelFilters } from '@/lib/api/types';
import { useAdvancedSearch } from '@/hooks/use-advanced-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NoResults } from '../advanced-search/no-results';
import { ModelCarousel } from '../shared/model-carousel';
import { motion } from 'framer-motion';

export default function AdvancedSearchTab() {
  const [filters, setFilters] = useState<ModelFilters>({});
  const { search, isLoading, results } = useAdvancedSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    await search(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    setIsOpen(false);
    setHasSearched(false);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card className="p-6 space-y-6">
      <TopFilters 
        filters={filters}
        onChange={setFilters}
      />
      
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <span>More Filters</span>
              {hasActiveFilters && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <SheetHeader className="p-6 pb-2">
              <SheetTitle>Advanced Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="p-6 space-y-6">
                <SideFilters 
                  filters={filters}
                  onChange={setFilters}
                />
              </div>
            </ScrollArea>
            <div className="p-6 pt-2 space-y-2 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {hasSearched && (
        <div className="pt-6 border-t">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
                <motion.h2 
                  className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Search Results
                </motion.h2>
              </motion.div>
              <ModelCarousel 
                results={results}
                showConfidence={false}
              />
            </div>
          ) : (
            <NoResults filters={filters} onReset={handleReset} />
          )}
        </div>
      )}
    </Card>
  );
}