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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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
        <Script id="istripper-config" strategy="afterInteractive">
          {`
            mobileAction = 'Yes';
            loadTool = {
              path: '/tb35e80da636/',
              outlink: 'https://vexlira.com/?s=84648&g=%C%',
              posX: 'right',
              playtype: 'random',
              anims: [
                {"id":"f0566_MelenaMariaRya_02","card":"f0566","model":"1093","posY":"bottom"},
                {"id":"e1306_MelenaMariaRya_04","card":"e1306","model":"1093","posY":"bottom"},
                {"id":"e1546_AgathaVega_nu","card":"e1546","model":"1374","posY":"bottom"},
                {"id":"e1746_AlissaFoxy_nu","card":"e1746","model":"1442","posY":"bottom"},
                {"id":"e1746_AlissaFoxy_nu2","card":"e1746","model":"1442","posY":"bottom"},
                {"id":"f0915_AlissaFoxy_01","card":"f0915","model":"1442","posY":"bottom"},
                {"id":"f1245_AlissaFoxy_hab","card":"f1245","model":"1442","posY":"bottom"},
                {"id":"e1317_AnastasiaBrokelyn_hab","card":"e1317","model":"1355","posY":"bottom"},
                {"id":"f0900_ChristyWhite_hab","card":"f0900","model":"1439","posY":"bottom"},
                {"id":"f0938_ChristyWhite_nu","card":"f0938","model":"1439","posY":"bottom"},
                {"id":"f0940_ChristyWhite_hab","card":"f0940","model":"1439","posY":"bottom"},
                {"id":"f0954_FreyaMayer_02","card":"f0954","model":"1423","posY":"bottom"},
                {"id":"e1011_HilaryC_hab","card":"e1011","model":"1233","posY":"bottom"},
                {"id":"f0608_JiaLissa_nu","card":"f0608","model":"1356","posY":"bottom"},
                {"id":"f1043_KellyCollins_01","card":"f1043","model":"1466","posY":"bottom"},
                {"id":"f1236_KellyCollins_02","card":"f1236","model":"1466","posY":"bottom"},
                {"id":"e1805_LanaLane_01","card":"e1805","model":"1443","posY":"bottom"},
                {"id":"e1805_LanaLane_02","card":"e1805","model":"1443","posY":"bottom"},
                {"id":"f1190_LaylaScarlett_02","card":"f1190","model":"1493","posY":"bottom"},
                {"id":"f0720_LittleCaprice_hab","card":"f0720","model":"870","posY":"bottom"},
                {"id":"e0762_MilaAzul_hab","card":"e0762","model":"1212","posY":"bottom"},
                {"id":"f0223_MilaAzul_nu","card":"f0223","model":"1212","posY":"bottom"},
                {"id":"f1182_MilenaRay_nu","card":"f1182","model":"1429","posY":"bottom"},
                {"id":"e1651_PaolaHard_02","card":"e1651","model":"1421","posY":"bottom"},
                {"id":"e1269_StellaCardo_hab","card":"e1269","model":"1345","posY":"bottom"},
                {"id":"e1270_StellaCardo_nu","card":"e1270","model":"1345","posY":"bottom"},
                {"id":"f0551_StellaCardo_hab","card":"f0551","model":"1345","posY":"bottom"},
                {"id":"f0910_Sybil_nu","card":"f0910","model":"1163","posY":"bottom"},
                {"id":"e1645_SonyaBlaze_ar_nonude","card":"e1645","model":"1427","posY":"bottom"},
                {"id":"f1112_SonyaBlaze_01","card":"f1112","model":"1427","posY":"bottom"},
                {"id":"f0946_SiaSiberia_03","card":"f0946","model":"1450","posY":"bottom"},
                {"id":"f0602_LiyaSilver_01","card":"f0602","model":"1327","posY":"bottom"},
                {"id":"f0913_AlissaFoxy_02","card":"f0913","model":"1442","posY":"bottom"},
                {"id":"e0086_ViolaBailey_02","card":"e0086","model":"967","posY":"bottom"},
                {"id":"e0114_SapphiraA_01","card":"e0114","model":"1106","posY":"bottom"},
                {"id":"e0450_GloriaSol_04","card":"e0450","model":"1169","posY":"bottom"},
                {"id":"e0454_GloriaSol_01","card":"e0454","model":"1169","posY":"bottom"}
              ]
            };
          `}
        </Script>

        {/* External JS Script ➜ iStripper kodu */}
        <Script
          src="/tb35e80da636.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}