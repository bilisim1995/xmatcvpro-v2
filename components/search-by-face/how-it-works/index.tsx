'use client';

import { Upload, Scan, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { StepCard } from './step-card';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      title: t('how_it_works.step1_title'),
      description: t('how_it_works.step1_description')
    },
    {
      icon: Scan,
      title: t('how_it_works.step2_title'),
      description: t('how_it_works.step2_description')
    },
    {
      icon: Sparkles,
      title: t('how_it_works.step3_title'),
      description: t('how_it_works.step3_description')
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
        >
          {t('how_it_works.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('how_it_works.subtitle')}
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 * (index + 4) }}
          >
            <StepCard
              icon={step.icon}
              step={index + 1}
              title={step.title}
              description={step.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}