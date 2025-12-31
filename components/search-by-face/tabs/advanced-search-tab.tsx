'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, X, Images, LayoutGrid, Megaphone, Sparkles, Loader2, Filter } from 'lucide-react';
import { SearchResult } from '@/lib/api/types';
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
import { ResultCard } from '../image-search/result-card';
import { AgeVerificationDialog } from '@/components/age-verification/age-verification-dialog';
import { useLanguage } from '@/components/contexts/LanguageContext';
import Image from 'next/image'; 

interface AdSlot {
  type: 'ad';
  id: string | number;
  imageUrl: string; 
}

function isAdSlot(item: ResultItem | null): item is AdSlot {
  return item !== null && typeof item === 'object' && 'type' in item && item.type === 'ad';
}

function AdCard({ ad }: { ad: AdSlot }) { 
  const { t } = useLanguage();
  return (
    <Card className="h-full w-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300 rounded-lg border">
      <a href={`#ad-${ad.id}`} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full aspect-[3/4] bg-muted/10">
        <Image
          src={ad.imageUrl}
          alt={`${t('searchresults.advertisement')} ${ad.id}`}
          layout="fill"
          objectFit="cover" // Changed from contain to cover
          className="group-hover:scale-105 transition-transform duration-300"
          unoptimized={true} 
          onError={(e) => {
            console.error("Error loading ad image:", ad.imageUrl, e);
            // Hide image if it fails to load instead of using external placeholder
            const target = e.currentTarget as HTMLImageElement;
            if (target.parentElement) {
              target.parentElement.style.display = 'none';
            }
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {`R${ad.id}`}
        </div>
      </a>
    </Card>
  );
}

type ResultItem = SearchResult | AdSlot;

export default function AdvancedSearchTab() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<ModelFilters>({});
  const { search, isLoading, results, error } = useAdvancedSearch();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [topFilters, setTopFilters] = useState<ModelFilters>({});
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const BUNNY_NET_PULL_ZONE_HOSTNAME = 'cdn.xmatch.pro'; 

  const handleSearch = async () => {
    setShowAgeVerification(true);
  };

  const handleVerified = async () => {
    setShowAgeVerification(false);
    setHasSearched(true);
    await search(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    setTopFilters({});
    setIsOpen(false);
    setHasSearched(false);
  };

  const handleRandomSearch = async () => {
    setHasSearched(true);
    
    const options = {
      cupSizes: ['a', 'b', 'c', 'd', 'dd', 'e', 'f', 'g'],
      ethnicities: ['caucasian', 'asian', 'ebony', 'latina', 'indian', 'mixed'],
      hairColors: ['blonde', 'brown', 'black', 'red', 'auburn'],
      eyeColors: ['blue', 'green', 'brown', 'hazel', 'grey'],
      nationalities: ['american', 'british', 'canadian', 'australian', 'german', 'french', 'italian', 'spanish', 'russian', 'japanese', 'korean', 'brazilian']
    };

    const randomCupSize = options.cupSizes[Math.floor(Math.random() * options.cupSizes.length)];
    const randomEthnicity = options.ethnicities[Math.floor(Math.random() * options.ethnicities.length)];
    const randomHairColor = options.hairColors[Math.floor(Math.random() * options.hairColors.length)];
    const randomEyeColor = options.eyeColors[Math.floor(Math.random() * options.eyeColors.length)];
    const randomNationality = options.nationalities[Math.floor(Math.random() * options.nationalities.length)];
    
    const randomFilters: ModelFilters = {
      age: Math.floor(Math.random() * (50 - 18) + 18),
      height: Math.floor(Math.random() * (190 - 150) + 150),
      weight: Math.floor(Math.random() * (80 - 45) + 45),
      cup_size: randomCupSize,
      ethnicity: randomEthnicity,
      hair_color: randomHairColor,
      eye_color: randomEyeColor,
      nationality: randomNationality,
      tattoos: Math.random() > 0.5 ? 'yes' : 'no',
      piercings: Math.random() > 0.5 ? 'yes' : 'no',
      random: true
    };

    setFilters(randomFilters);
    setTopFilters({
      hair_color: randomHairColor,
      eye_color: randomEyeColor,
      cup_size: randomCupSize,
      nationality: randomNationality
    });

    setShowAgeVerification(true);
  };

  const handleRandomVerified = async () => {
    setShowAgeVerification(false);
    setIsLoadingRandom(true);
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await fetch(`/api/models?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Timestamp': Date.now().toString()
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch random models');
      }
      
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No random models found');
      }
      
      const shuffledData = data
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      await search({}, shuffledData);
    } catch (error) {
      console.error('Random search error:', error);
      toast({
        title: t('advancedsearch.error_title'),
        description: error instanceof Error ? error.message : t('advancedsearch.random_search_error'),
        variant: 'destructive'
      });
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const finalResultsWithAds: ResultItem[] = [];
  let adCounter = 1;
  const limitedResults = results.slice(0, 15);

  for (let i = 0; i < limitedResults.length; i++) {
    finalResultsWithAds.push(limitedResults[i]);
    if ((i + 1) % 3 === 0 && adCounter <= 5) {
      finalResultsWithAds.push({
        type: 'ad',
        id: `${adCounter}`,
        imageUrl: `https://${BUNNY_NET_PULL_ZONE_HOSTNAME}/ads/r${adCounter}.svg`
      });
      adCounter++;
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <TopFilters 
        filters={topFilters}
        onChange={(newFilters) => {
          setTopFilters(newFilters);
          setFilters({ ...filters, ...newFilters });
        }}
      />
      
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 relative">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{t('advancedsearch.more_filters')}</span>
                {hasActiveFilters && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {Object.keys(filters).length}
                  </span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-hidden">
            <SheetHeader className="p-6 pb-2">
              <SheetTitle>{t('advancedsearch.advanced_filters')}</SheetTitle>
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
                {t('advancedsearch.apply_filters')}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('advancedsearch.reset_filters')}
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
          {t('advancedsearch.search')}
        </Button>

        <Button
          onClick={handleRandomSearch}
          disabled={isLoadingRandom}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          {isLoadingRandom ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('advancedsearch.loading_random_models')}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-bounce" />
              {t('advancedsearch.feeling_lucky')}
            </>
          )}
        </Button>
      </div>

        {hasSearched && (
          <div className="pt-6 border-t">
            {(isLoading || isLoadingRandom) ? (
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
                  className="flex items-center justify-center gap-4 mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                >
                  <motion.h2 
                    className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 mr-2"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {t('advancedsearch.search_results')}
                  </motion.h2>
                  <div className="flex gap-1 items-center">
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
                </motion.div>

                {viewMode === 'carousel' ? (
                  <ModelCarousel 
                    results={finalResultsWithAds} 
                    showConfidence={false}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {finalResultsWithAds.map((item, idx) => { 
                      if (isAdSlot(item)) { 
                        return <AdCard key={`ad-${item.id}`} ad={item} />;
                      }
                      const searchResultItem = item as SearchResult;
                      return (
                        <ResultCard
                          key={searchResultItem.id}
                          result={searchResultItem}
                          index={idx - Math.floor(idx / 4)} 
                          showConfidence={false}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <NoResults filters={filters} onReset={handleReset} />
            )}
          </div>
        )}
      
      <AgeVerificationDialog 
        open={showAgeVerification} 
        onOpenChange={setShowAgeVerification}
        onVerify={filters.random === true ? handleRandomVerified : handleVerified}
      />
    </Card>
  );
}
