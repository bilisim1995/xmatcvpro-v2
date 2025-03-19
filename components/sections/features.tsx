'use client';

import { Upload, Zap, Target } from 'lucide-react';

export function Features() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Upload className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
          <p className="text-muted-foreground">
            Simply drag and drop or click to upload your image. Supports all major image formats.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Zap className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-muted-foreground">
            Our advanced AI algorithms analyze images to find matching adult content.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Target className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
          <p className="text-muted-foreground">
            Get the top 3 most similar matches with accuracy percentages in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}