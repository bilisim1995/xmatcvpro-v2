'use client';

import { Upload, Zap, Target } from 'lucide-react';
import { useLanguage } from '@/components/contexts/LanguageContext';
import Link from 'next/link';

export function Features() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Upload className="w-12 h-12 text-red-600 mb-4" />
          <Link href="/search" className="text-xl font-semibold mb-2 hover:underline">
            {t('features.upload_title')}
          </Link>
          <p className="text-muted-foreground">
            {t('features.upload_description')}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Zap className="w-12 h-12 text-red-600 mb-4" />
          <Link href="/search" className="text-xl font-semibold mb-2 hover:underline">
            {t('features.smart_search_title')}
          </Link>
          <p className="text-muted-foreground">
            {t('features.smart_search_description')}
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-red-500/50 transition-colors">
          <Target className="w-12 h-12 text-red-600 mb-4" />
          <Link href="/search" className="text-xl font-semibold mb-2 hover:underline">
            {t('features.instant_results_title')}
          </Link>
          <p className="text-muted-foreground">
            {t('features.instant_results_description')}
          </p>
        </div>
      </div>
    </div>
  );
}