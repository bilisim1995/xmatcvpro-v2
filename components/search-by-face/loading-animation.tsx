 'use client';
import { useLanguage } from '@/components/contexts/LanguageContext';

import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingAnimation() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* AI Brain Animation */}
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl animate-pulse" />
        
        {/* Neural Network Lines */}
        <div className="absolute inset-0 rotate-45">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[2px] bg-gradient-to-r from-red-500/0 via-red-600/50 to-red-500/0"
              style={{
                top: `${i * 20}%`,
                animation: 'shimmer 2s linear infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Brain Icon */}
        <div className="relative w-20 h-20 rounded-full bg-background flex items-center justify-center">
          <Brain className="w-12 h-12 text-red-600" />
        </div>

        {/* Circular Progress */}
        <div className="absolute inset-0 rounded-full border-4 border-red-600/20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-red-600 border-l-transparent border-r-transparent animate-[spin_3s_linear_infinite]" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 space-y-2 text-center">
        <h3 className="text-lg font-medium">
          {t('loadinganimation.analyzing')}
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-sm text-muted-foreground">
            {t('loadinganimation.may_take_time')}
          </p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed"
          >
            {t('loadinganimation.detailed_description')}
          </motion.p>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-red-600"
            style={{
              animation: `bounce 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}