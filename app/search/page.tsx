'use client';

import { SearchHeader } from '@/components/search-by-face/search-header';
import { SearchTabs } from '@/components/search-by-face/tabs/index';
import { HowItWorks } from '@/components/search-by-face/how-it-works';
import { PremiumBanner } from '@/components/advertising/premium-banner';
import { BlogSection } from '@/components/search-by-face/blog';
import { DevelopmentStatus } from '@/components/search-by-face/development-status';
import { Card } from '@/components/ui/card';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <SearchHeader />

      <Card className="max-w-4xl mx-auto p-6 shadow-xl">
        <SearchTabs />
      </Card>
      
      <div className="max-w-4xl mx-auto mt-16">
        <HowItWorks />
      </div>
      
      <div className="max-w-4xl mx-auto mt-16">
        <PremiumBanner />
      </div>
      
      <div className="max-w-4xl mx-auto mt-16">
        <BlogSection />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <DevelopmentStatus />
      </div>
    </div>
  );
}