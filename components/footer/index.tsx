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
          {/* Left side: Copyright and Legal Links - Same line */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start w-full sm:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {t('footer.copyright')}
            </span>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/rta" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.rta')}
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/disclaimer" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.disclaimer')}
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/2257" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.2257')}
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/dmca" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.dmca')}
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/privacy" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.privacy')}
            </Link>
            <span className="text-sm text-muted-foreground">|</span>
            <Link 
              href="/legal/terms" 
              className="text-sm text-muted-foreground hover:text-red-600 transition-colors whitespace-nowrap"
            >
              {t('footer.terms')}
            </Link>
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
