'use client';

import { Info } from 'lucide-react';

export function DevelopmentStatus() {
  return (
    <div className="mt-16">
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Development Version:</p>
              <span className="text-sm text-muted-foreground">0.2.0</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">Status:</p>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                Beta
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Models and search technology are continuously being updated and improved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}