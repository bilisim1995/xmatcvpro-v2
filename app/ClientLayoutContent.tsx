'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/index';
import { Analytics } from '@/components/analytics';
import { ConsentBanner } from '@/components/gdpr/consent-banner';
import { AgeVerification } from '@/components/age-verification/age-verification';
import { ScrollToTop } from '@/components/scroll-to-top';
import { Toaster } from '@/components/ui/toaster';
import { YandexMetrika } from '@/components/analytics/yandex-metrika';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleTagManager } from '@/components/analytics/google-tag-manager';
import { MicrosoftClarity } from '@/components/analytics/microsoft-clarity';

export default function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname === '/sensual-vibes';

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <YandexMetrika />
        <GoogleAnalytics />
        <GoogleTagManager />
        <MicrosoftClarity />
        {children}
      </main>
      {!hideFooter && <Footer />} {/* Conditionally render Footer */}
      <ScrollToTop />
      <ConsentBanner />
      <AgeVerification />
      <Toaster />
      <Analytics /> {/* Keep the main Analytics component which uses hooks */}
    </>
  );
}
