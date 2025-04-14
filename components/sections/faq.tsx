'use client';

import { useLanguage } from '@/components/contexts/LanguageContext';

export function FAQ() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        {t('faq.title')}
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('faq.q1_title')}</h3>
          <p className="text-muted-foreground">{t('faq.q1_answer')}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('faq.q2_title')}</h3>
          <p className="text-muted-foreground">{t('faq.q2_answer')}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('faq.q3_title')}</h3>
          <p className="text-muted-foreground">{t('faq.q3_answer')}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('faq.q4_title')}</h3>
          <p className="text-muted-foreground">{t('faq.q4_answer')}</p>
        </div>
      </div>
    </div>
  );
}