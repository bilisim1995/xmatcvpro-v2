'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Model Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested model could not be found. The model may have been removed or the URL might be incorrect.
        </p>
        <Button
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white"
        >
          Go Back
        </Button>
      </Card>
    </div>
  );
}