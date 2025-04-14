'use client';

import { Card } from '@/components/ui/card';
import { DollarSign, Video } from 'lucide-react';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function AdOptions() {
  const { t } = useLanguage();

  const adOptions = [
    {
      title: t('adoptions.premium_banner_ads'),
      description: t('adoptions.premium_banner_description'),
      icon: DollarSign
    },
    {
      title: t('adoptions.sponsored_content'),
      description: t('adoptions.sponsored_content_description'),
      icon: DollarSign
    },
    {
      title: t('adoptions.sponsored_videos'),
      description: t('adoptions.sponsored_videos_description'),
      icon: Video
    },
    {
      title: t('adoptions.partnership_opportunities'),
      description: t('adoptions.partnership_opportunities_description'),
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-4">
      {adOptions.map((option, index) => (
        <Card key={index} className="p-4 space-y-2 hover:bg-accent/50 transition-colors">
          <h4 className="font-medium flex items-center gap-2">
            <option.icon className="w-4 h-4 text-red-600" />
            {option.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {option.description}
          </p>
        </Card>
      ))}
    </div>
  );
}