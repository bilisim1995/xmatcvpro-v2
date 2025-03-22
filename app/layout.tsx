import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer/index';
import { Analytics } from '@/components/analytics';
import { LoadingScreen } from '@/components/loading';
import { ConsentBanner } from '@/components/gdpr/consent-banner';
import { AgeVerification } from '@/components/age-verification/age-verification';
import { ScrollToTop } from '@/components/scroll-to-top';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';

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
       <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#dc2626" />
        <link rel="icon" href="/favicon.ico" />
  
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
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
          <SpeedInsights/>
          <Toaster />
        </ThemeProvider>
        <Analytics />
       
      </body>
    </html>
  );
}