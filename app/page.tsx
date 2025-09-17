"use client";

import { SearchHeader } from '@/components/search-by-face/search-header';
import { SearchTabs } from '@/components/search-by-face/tabs/index';
import dynamic from 'next/dynamic';
const HowItWorks = dynamic(() => import('@/components/search-by-face/how-it-works').then(m => m.HowItWorks), { ssr: false, loading: () => <div className="h-40 animate-pulse bg-muted rounded-lg" /> });
const PremiumBanner = dynamic(() => import('@/components/advertising/premium-banner').then(m => m.PremiumBanner), { ssr: false, loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" /> });
const BlogSection = dynamic(() => import('@/components/search-by-face/blog').then(m => m.BlogSection), { ssr: false, loading: () => <div className="h-60 animate-pulse bg-muted rounded-lg" /> });
const DevelopmentStatus = dynamic(() => import('@/components/search-by-face/development-status').then(m => m.DevelopmentStatus), { ssr: false, loading: () => <div className="h-20 animate-pulse bg-muted rounded-lg" /> });
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