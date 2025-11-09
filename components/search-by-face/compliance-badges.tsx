'use client';

import { Shield, Smartphone, Globe, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function ComplianceBadges() {
  const { t } = useLanguage();

  const complianceItems = [
    {
      icon: Shield,
      title: t('compliancebadges.wcag_title'),
      description: t('compliancebadges.wcag_description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Smartphone,
      title: t('compliancebadges.pwa_title'),
      description: t('compliancebadges.pwa_description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: Globe,
      title: t('compliancebadges.w3c_title'),
      description: t('compliancebadges.w3c_description'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: Lock,
      title: t('compliancebadges.https_title'),
      description: t('compliancebadges.https_description'),
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
  ];

  return (
    <Card className="p-4 sm:p-6 shadow-xl mt-6" role="region" aria-label="Compliance and standards">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">{t('compliancebadges.title')}</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {complianceItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                role="listitem"
              >
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} aria-hidden="true" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {t('compliancebadges.footer_message')}
          </p>
        </div>
      </div>
    </Card>
  );
}

