'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/index';
import { Analytics } from '@/components/analytics';
import { AnalyticsLoader } from '@/components/analytics/analytics-loader';
import { ConsentBanner } from '@/components/gdpr/consent-banner';
import { AgeVerification } from '@/components/age-verification/age-verification';
import { ScrollToTop } from '@/components/scroll-to-top';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/contexts/LanguageContext';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname === '/sensual-vibes';

  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">
          {/* Render children, which are your page components */}
          {children}
        </main>
        {!hideFooter && <Footer />} {/* Conditionally render Footer */}
        <ScrollToTop />
        <ConsentBanner />
        <AgeVerification />
        <Toaster />
        {/* Analytics with GDPR consent control */}
        <AnalyticsLoader />
        {/* Page view tracking - only tracks, doesn't render analytics scripts */}
        <Analytics />
      </ThemeProvider>
    </LanguageProvider>
  );
}
