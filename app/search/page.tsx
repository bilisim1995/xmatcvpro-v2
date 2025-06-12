'use client';

import { SearchHeader } from '@/components/search-by-face/search-header';
import { SearchTabs } from '@/components/search-by-face/tabs/index';
import { HowItWorks } from '@/components/search-by-face/how-it-works';
import { PremiumBanner } from '@/components/advertising/premium-banner';
import { BlogSection } from '@/components/search-by-face/blog';
import { DevelopmentStatus } from '@/components/search-by-face/development-status';
import { Card } from '@/components/ui/card';
import { CoffeeButton } from '@/components/coffee-button';
import { SensualVibesPrompt } from '@/components/sensual-vibes-prompt';

export default function SearchPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="w-full max-w-full px-2 sm:container sm:mx-auto sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-16">
        <SearchHeader />

        <div className="w-full sm:max-w-4xl mx-auto overflow-hidden">
          <Card className="w-full p-3 sm:p-6 shadow-xl mb-6 sm:mb-8">
            <SearchTabs />
          </Card>

          <div className="mb-6 sm:mb-8">
            <CoffeeButton />
          </div>
      
          <div className="mb-6 sm:mb-8">
            <HowItWorks />
          </div>
      
          <div className="mb-6 sm:mb-8">
            <PremiumBanner />
          </div>
      
          <div className="mb-6 sm:mb-8">
            <BlogSection />
          </div>
      
          <div>
            <DevelopmentStatus />
          </div>
        </div>
      </div>
      <SensualVibesPrompt />
    </div>
  );
}
