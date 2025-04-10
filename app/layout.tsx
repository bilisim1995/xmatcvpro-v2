import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/index';
import { Analytics } from '@/components/analytics';
import { ConsentBanner } from '@/components/gdpr/consent-banner';
import { AgeVerification } from '@/components/age-verification/age-verification';
import { ScrollToTop } from '@/components/scroll-to-top';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'system-ui',
    'sans-serif'
  ],
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://xmatch.pro'),
  title: {
    default: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    template: '%s | xmatch.pro'
  },
  description: 'The First Porn Star face-recognizing search engine based on deep neural networks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="xmatch.pro" />
        <meta name="application-name" content="xmatch.pro" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#dc2626" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="rating" content="RTA-5042-1996-1400-1577-RTA" />
        <meta name="yandex-verification" content="4e50b414c62d2ced" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
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
            {children}
          </main> 
          <Footer />
          <ScrollToTop />
          <ConsentBanner />
          <AgeVerification />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}