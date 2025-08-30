'use client';

import { Menu, Scan, Star, Construction, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from './logo'; // Import the Logo component

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex justify-center py-4">
          <Logo size={60} />
        </div>
        <Separator />
        <nav className="flex flex-col gap-4 pt-6">
          {/* Search by Face */}
          <Link
            href="/search"
            className="flex items-center gap-3 px-3 py-2 text-lg hover:bg-muted/50 rounded-md transition-colors"
          >
            <Scan className="w-5 h-5 text-muted-foreground" />
            <span>SEARCH BY FACE</span>
          </Link>

          <Separator />

          {/* Sensual Vibes Link with Animation */}
          <Link
            href="/sensual-vibes"
            className="flex items-center gap-3 px-3 py-2 text-lg hover:bg-muted/50 rounded-md transition-colors"
          >
            <motion.div 
              className="flex items-center gap-3"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <VideoIcon className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-500 dark:text-red-400">SENSUAL VIBES</span>
            </motion.div>
          </Link>

          <Separator />

          <Link
            href="/top-list"
            className="flex items-center gap-3 px-3 py-2 text-lg hover:bg-muted/50 rounded-md transition-colors"
          >
            <Star className="w-5 h-5 text-muted-foreground" />
            <span>GOLDEN LIST</span>
          </Link>

        </nav>
      </SheetContent>
    </Sheet>
  );
}
