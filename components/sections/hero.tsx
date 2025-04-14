'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function Hero() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleStartSearch = () => {
    router.push('/search');
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-background/20 to-background dark:from-red-950/30 dark:via-background/20 dark:to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16 relative">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 relative flex-shrink-0">
              <Image
                src="/m3.png"
                alt="Mascot"
                width={128}
                height={128}
                className="w-full h-full animate-pulse object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
              xmatch.pro
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl">
            {t('hero.description')}
          </p>

          <Button 
            onClick={handleStartSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <span>{t('hero.start_search')}</span>
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}