'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult } from '@/lib/api/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from 'lucide-react';

interface SuggestedModelsProps {
  models: SearchResult[];
}

export function SuggestedModels({ models }: SuggestedModelsProps) {
  if (!models?.length) return null;

  return (
    <div className="mt-16 space-y-6">
      <motion.h2 
        className="text-2xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        You May Also Like
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/models/${model.slug || encodeURIComponent(model.name.toLowerCase().replace(/\s+/g, '-'))}`}>
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/10">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy" 
                  />
                  {/* Quick Info Badge */}
                  {model.age && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-0 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {model.age} y/o
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors">
                    {model.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.ethnicity && (
                      <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10">
                        {model.ethnicity}
                      </Badge>
                    )}
                    {model.hair && (
                      <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/10">
                        {model.hair}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}