'use client';

import { SearchHeader } from '@/components/search-by-face/search-header';
import { SearchTabs } from '@/components/search-by-face/tabs/index';
import { HowItWorks } from '@/components/search-by-face/how-it-works';
import { PremiumBanner } from '@/components/advertising/premium-banner';
import { BlogSection } from '@/components/search-by-face/blog';
import { DevelopmentStatus } from '@/components/search-by-face/development-status';
import { Card } from '@/components/ui/card';
import { CoffeeButton } from '@/components/coffee-button';

export default function SearchPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16">
      <SearchHeader />

        <div className="max-w-4xl mx-auto">
          <Card className="w-full p-4 sm:p-6 shadow-xl mb-8">
            <SearchTabs />
          </Card>

          <div className="m-14 flex justify-center">
            <CoffeeButton />
          </div>
      
          <div className="mb-8">
            <HowItWorks />
          </div>
      
          <div className="mb-8">
            <PremiumBanner />
          </div>
      
          <div className="mb-8">
            <BlogSection />
          </div>
      
          <div>
            <DevelopmentStatus />
          </div>
        </div>
      </div>
    </div>
  );
}