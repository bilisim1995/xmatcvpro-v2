'use client';

import { useState } from 'react';
import Image from 'next/image';

export function Features() {
  const [imageError, setImageError] = useState(false);
  
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src={imageError ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' : '/m3.png'}
              alt="Feature illustration"
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              priority
            />
          </div>
          {/* Add your features content here */}
        </div>
      </div>
    </section>
  );
}