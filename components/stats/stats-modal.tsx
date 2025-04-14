'use client';

import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatsSection } from './stats-section';
import { MetricsCard } from './metrics-card';
import { DistributionBar } from './distribution-bar';
import { statsData } from './stats-data'; 
import { useLanguage } from '@/components/contexts/LanguageContext';

interface StatsModalProps {
  trigger?: React.ReactNode;
}

export function StatsModal({ trigger }: StatsModalProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="hover:text-red-600 transition-colors">
            <BarChart3 className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            {t('statsmodal.platform_statistics')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {statsData.metrics.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>

            {/* Demographics */}
            <StatsSection icon={BarChart3} title={t('statsmodal.user_demographics')}>
              <div className="space-y-6">
                {/* Gender Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('statsmodal.gender_distribution')}</h4>
                  <div className="space-y-2">
                    {statsData.demographics.gender.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.type}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <DistributionBar percentage={item.percentage} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('statsmodal.age_distribution')}</h4>
                  <div className="space-y-2">
                    {statsData.demographics.age.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.group}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <DistributionBar percentage={item.percentage} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Distribution */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('statsmodal.country_distribution')}</h4>
                  <div className="space-y-2">
                    {statsData.demographics.countries.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">{item.users}</span>
                        </div>
                        <DistributionBar percentage={item.percentage} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t('statsmodal.activity_statistics')}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {statsData.demographics.activity.map((item, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                        <p className="text-sm font-medium mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StatsSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}