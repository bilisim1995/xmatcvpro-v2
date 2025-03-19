'use client';

import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-lg" />
        </Card>
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-muted rounded-lg w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-full w-24" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}