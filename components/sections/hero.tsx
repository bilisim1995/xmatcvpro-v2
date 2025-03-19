'use client';

import { Search, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();

  const handleStartSearch = () => {
    router.push('/search');
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-background/20 to-background dark:from-red-950/30 dark:via-background/20 dark:to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16 relative">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <Search className="w-16 h-16 md:w-20 md:h-20 text-red-600 animate-pulse" />
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-400 absolute -right-2 top-0 animate-bounce" />
            <Target className="w-5 h-5 md:w-6 md:h-6 text-red-500 absolute -left-2 bottom-0 animate-spin-slow" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
            xmatch.pro
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Find similar adult content using advanced AI technology. Upload any image to discover matching models instantly.
          </p>

          <Button 
            onClick={handleStartSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <span>Start Searching</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}