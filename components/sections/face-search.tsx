'use client';

import { MoveRight, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchDemoAnimation } from './search-demo-animation';

export function FaceSearch() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 border-t bg-card/50">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <SearchDemoAnimation />
        </div>
        <div className="space-y-4 sm:space-y-6 order-1 md:order-2">
          <div className="inline-block p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Scan className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Pornstars Search by Face with AI</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Upload any face photo and our AI will find matching adult performers from our extensive database. Get instant, accurate matches with our advanced facial recognition technology.
          </p>
          <ul className="space-y-2 sm:space-y-3">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-sm sm:text-base">Advanced facial recognition AI</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-sm sm:text-base">Matches from 1M+ performer database</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-sm sm:text-base">99% accuracy rate</span>
            </li>
          </ul>
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Try Face Search
            <MoveRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}