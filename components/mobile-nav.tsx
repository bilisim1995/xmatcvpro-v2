'use client';

import { Menu, Scan, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

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
        <nav className="flex flex-col gap-4">
          {/* Search by Face */}
          <Link
            href="/search"
            className="flex items-center gap-2 px-2 py-1 text-lg hover:text-red-600 transition-colors"
          >
            <Scan className="w-5 h-5" />
            SEARCH BY FACE
          </Link>

          <Separator />

          <Link
            href="/top-list"
            className="flex items-center gap-2 px-2 py-1 text-lg hover:text-red-600 transition-colors"
          >
            <Star className="w-5 h-5" />
            GOLDEN LIST
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}