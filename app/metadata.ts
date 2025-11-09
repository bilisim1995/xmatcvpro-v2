import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://xmatch.pro'),
  title: {
    default: 'xmatch.pro - AI-Powered Adult Content Search Engine | Face Recognition Technology',
    template: '%s | xmatch.pro'
  },
  description: 'Find pornstars and adult models using AI-powered face recognition technology. Upload any face photo and discover matching performers instantly with 99% accuracy. Advanced neural network search engine for adult content discovery.',
  keywords: [
    'face recognition',
    'AI search',
    'adult content search',
    'porn star finder',
    'image search',
    'neural networks',
    'deep learning',
    'adult entertainment',
    'model search',
    'AI technology',
    'yapay zeka',
    'yüz tanıma',
    'porno yıldızı arama',
    'görsel arama'
  ],
  authors: [{ name: 'xmatch.pro Team' }],
  creator: 'xmatch.pro',
  publisher: 'xmatch.pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr',
      'de-DE': '/de',
      'ru-RU': '/ru',
      'hi-IN': '/hi',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xmatch.pro',
    siteName: 'xmatch.pro',
    title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    description: 'Find pornstars and adult models using AI-powered face recognition technology. Upload any face photo and discover matching performers instantly with 99% accuracy.',
    images: [
      {
        url: '/m1.png',
        width: 1200,
        height: 630,
        alt: 'xmatch.pro AI Face Recognition - Advanced Face Search Technology',
      },
    ],
    alternateLocale: ['tr_TR', 'de_DE', 'ru_RU', 'hi_IN', 'zh_CN'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    description: 'Find pornstars and adult models using AI-powered face recognition technology. Upload any face photo and discover matching performers instantly.',
    images: ['/m1.png'],
    creator: '@xmatchpro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#dc2626' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'xmatch.pro',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'xmatch.pro',
    'application-name': 'xmatch.pro',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#dc2626',
    'theme-color': '#dc2626',
    'rating': 'RTA-5042-1996-1400-1577-RTA',
    'category': 'technology',
    'classification': 'Adult Entertainment Technology',
  },
};
