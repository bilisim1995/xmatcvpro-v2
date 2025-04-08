'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function SearchHeader() {
  return (
    <div className="flex items-center justify-center gap-8 mb-12 pt-6 sm:pt-0">
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
        <Image
          src="/m1.png"
          alt="Mascot"
          width={128}
          height={128}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
          Pornstar Search by Face with AI
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md">
          Upload any face photo and our AI will find matching pornstar models from our extensive database.
        </p>
      </div>
    </div>
  );
}
