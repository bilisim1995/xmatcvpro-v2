'use client'; 

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
        {/* Main flex container for footer content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left side: Copyright and Legal Links */}
          <div className="flex flex-col items-center sm:items-start gap-2 w-full sm:w-auto">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {t('footer.copyright')}
            </p>
            {/* Scrollable container for legal links on mobile */}
            <div className="w-full sm:w-auto overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-3 sm:gap-4 justify-center sm:justify-start">
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
          </div>
          {/* Right side: Action Buttons and Social Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ActionButtons />
            <Separator orientation="vertical" className="h-5 hidden sm:block" />
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
