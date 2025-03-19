'use client';

import { Card } from '@/components/ui/card';

export function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-muted" />
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-3/4" />
              <div className="h-1.5 bg-muted rounded-full w-full" />
              <div className="h-3 bg-muted rounded-md w-1/4" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-muted rounded-md" />
              <div className="h-8 bg-muted rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}