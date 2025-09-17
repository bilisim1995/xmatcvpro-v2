import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://xmatch.pro'),
  title: {
    default: 'xmatch.pro - AI-Powered Adult Content Search Engine | Face Recognition Technology',
    template: '%s | xmatch.pro'
  },
  description: 'Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly with 99% accuracy. The most advanced porn star search engine powered by deep neural networks.',
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
    description: 'Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly with 99% accuracy.',
    images: [
      {
        url: '/m1.png',
        width: 128,
        height: 128,
        alt: 'xmatch.pro AI Face Recognition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    description: 'Discover adult content with advanced AI face recognition technology. Upload any image and find similar models instantly.',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
  classification: 'Adult Entertainment Technology',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'xmatch.pro',
    'application-name': 'xmatch.pro',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};
