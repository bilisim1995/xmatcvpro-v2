'use client';

import Link from 'next/link';
import { Construction, Scan, Star, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Import motion from framer-motion

export function NavMenu() {
  return (
    <div className="hidden md:flex items-center gap-6 ml-12">
      <Link href="/search">
        <Button variant="ghost" className="flex items-center gap-2 text-base font-medium">
          <Scan className="w-4 h-4" />
          SEARCH BY FACE
        </Button>
      </Link>

      <Link href="/top-list">
        <Button variant="ghost" className="flex items-center gap-2 text-base font-medium">
          <Star className="w-4 h-4" />
          GOLDEN LIST
        </Button>
      </Link>


    </div>
  );
}