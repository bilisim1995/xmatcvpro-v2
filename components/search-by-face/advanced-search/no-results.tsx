'use client';

import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModelFilters } from '@/lib/api/types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/contexts/LanguageContext';

interface NoResultsProps {
  filters: ModelFilters;
  onReset: () => void;
}

export function NoResults({ filters, onReset }: NoResultsProps) {
  const { t } = useLanguage();

  const activeFilters = Object.entries(filters)
    .filter(([value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ');
      return `${formattedKey}: ${value}`;
    });

  return (
    <motion.div 
      className="text-center py-8 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <Search className="w-8 h-8 text-red-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('noresults.title')}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('noresults.description')}
        </p>
      </div>

      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('noresults.active_filters')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {activeFilters.map((filter, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={onReset}
        className="mt-4"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {t('noresults.reset_filters')}
      </Button>
    </motion.div>
  );
}