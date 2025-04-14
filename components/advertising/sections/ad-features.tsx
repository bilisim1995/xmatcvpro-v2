'use client';

import { Target, Rocket } from 'lucide-react';
import { FeatureCard } from '../features/feature-card';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function AdFeatures() {
  const { t } = useLanguage();

  return (
    <section className="space-y-4">
      <p className="text-lg text-muted-foreground">
        {t('adfeatures.reach_users')}
      </p>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <FeatureCard
          icon={Target}
          title={t('adfeatures.targeted_audience')}
          description={t('adfeatures.targeted_audience_description')}
        />
        
        <FeatureCard
          icon={Rocket}
          title={t('adfeatures.premium_placement')}
          description={t('adfeatures.premium_placement_description')}
        />
      </div>
    </section>
  );
}