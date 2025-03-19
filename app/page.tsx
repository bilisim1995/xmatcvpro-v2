import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { AdditionalFeatures } from '@/components/sections/additional-features';
import { FaceSearch } from '@/components/sections/face-search';
import { FAQ } from '@/components/sections/faq';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-background to-background/95 dark:from-red-950/20 dark:via-background dark:to-background/95 pt-16">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <AdditionalFeatures />
        <FaceSearch />
        <FAQ />
      </Suspense>
    </div>
  );
}