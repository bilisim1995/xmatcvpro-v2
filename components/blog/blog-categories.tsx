'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  'All',
  'General'
];

export function BlogCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      router.push('/blog', { scroll: false });
    } else {
      router.push(`/blog?category=${category}`, { scroll: false });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="flex flex-col gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? 'default' : 'ghost'}
            className="justify-start"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </Card>
  );
}