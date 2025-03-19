'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AnimatedTitle = dynamic(() => import('./animated-title').then(mod => mod.AnimatedTitle), {
  ssr: false,
  loading: () => (
    <div className="text-center mb-12">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {['SEARCH', 'BY', 'FACE', 'WITH', 'AI'].map((word) => (
          <span
            key={word}
            className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 relative"
          >
            {word}
          </span>
        ))}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload any face photo and our AI will find matching models from our extensive database.
      </p>
    </div>
  )
});

export function SearchHeader() {
  return (
    <Suspense fallback={null}>
      <AnimatedTitle />
    </Suspense>
  );
}