'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/index';
import { Analytics } from '@/components/analytics';
import { ConsentBanner } from '@/components/gdpr/consent-banner';
import { AgeVerification } from '@/components/age-verification/age-verification';
import { ScrollToTop } from '@/components/scroll-to-top';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/components/contexts/LanguageContext';
// Import individual analytics components as they are likely client components
import { YandexMetrika } from '@/components/analytics/yandex-metrika';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleTagManager } from '@/components/analytics/google-tag-manager';

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
        {/* Render individual analytics components directly within the client wrapper */}
        {/* Make sure these are client components or correctly handle server components within them if needed */}
        <Analytics />
        <YandexMetrika />
        <GoogleAnalytics />
        <GoogleTagManager />
      </ThemeProvider>
    </LanguageProvider>
  );
}
