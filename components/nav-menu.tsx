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

      <Link href="/sensual-vibes">
        <motion.div
          className="rounded-md" // Butonun şekline uyması için
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(239, 68, 68, 0.0)", // Başlangıçta gölge yok (EF4444 red-500)
              "0 0 10px 4px rgba(239, 68, 68, 0.7)", // Parlama efekti
              "0 0 0px 0px rgba(239, 68, 68, 0.0)", // Gölgelenmenin bitişi
            ],
          }}
          transition={{
            duration: 2, // Bir döngünün süresi
            repeat: Infinity, // Animasyonu sonsuz tekrarla
            ease: "easeInOut", // Yumuşak geçiş için
          }}
        >
          <Button variant="ghost" className="flex items-center gap-2 text-base font-medium text-red-500 dark:text-red-400">
            <Video className="w-4 h-4" />
            SENSUAL VIBES
          </Button>
        </motion.div>
      </Link>

      <Link
        href="https://theporndude.com/"
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="flex items-center gap-2 px-2 py-1 text-lg hover:text-red-600 transition-colors"
      >
        <Construction className="w-5 h-5" />
        ThePornDude
      </Link>

    </div>
  );
}