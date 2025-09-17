'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function SearchHeader() {
  const { t } = useLanguage();

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
          sizes="(max-width: 640px) 7rem, 8rem"
        />
      </div>
      <div className="text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
          {t('search_header.title')}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md">
          {t('search_header.description')}
        </p>
      </div>
    </div>
  );
}
