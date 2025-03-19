'use client';

import { ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  image: string | null;
}

export function ImagePreview({ image }: ImagePreviewProps) {
  return (
    <div className="relative w-32 h-32">
      {image ? (
        <div className="w-full h-full rounded-lg overflow-hidden border-2 border-dotted border-red-500/30 shadow-lg">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-full h-full rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}