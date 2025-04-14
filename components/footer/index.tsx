'use client'; // 💥 BU ŞART

import { Separator } from '@/components/ui/separator';
import { ActionButtons } from './action-buttons';
import { SocialLinks } from './social-links';
import Link from 'next/link';
import { useLanguage } from '@/components/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/legal/rta" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.rta')}
              </Link>
              <Link 
                href="/legal/disclaimer" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.disclaimer')}
              </Link>
              <Link 
                href="/legal/2257" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.2257')}
              </Link>
              <Link 
                href="/legal/dmca" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.dmca')}
              </Link>
              <Link 
                href="/legal/privacy" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                href="/legal/terms" 
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ActionButtons />
            <Separator orientation="vertical" className="h-5" />
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}