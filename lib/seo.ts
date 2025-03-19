export const defaultMetadata = {
  title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
  description: 'The First Porn Star face-recognizing search engine based on deep neural networks. Find your favorite adult performers using advanced AI technology.',
  keywords: [
    'face',
    'pornstar',
    'search porn star',
    'search pornstar by face',
    'face detect',
    'ponmodels',
    'ai',
    'facial recognition',
    'adult content search',
    'ai face detection'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://xmatch.pro',
    title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    description: 'The First Porn Star face-recognizing search engine based on deep neural networks.',
    siteName: 'xmatch.pro',
    images: [
      {
        url: 'https://xmatch.pro/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'xmatch.pro'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xmatch.pro - AI-Powered Adult Content Search Engine',
    description: 'The First Porn Star face-recognizing search engine based on deep neural networks.',
    creator: '@xmatchpro',
    images: ['https://xmatch.pro/twitter-image.jpg']
  }
};

export const generateMetadata = (path: string) => {
  const baseUrl = 'https://xmatch.pro';
  const currentUrl = `${baseUrl}${path}`;
  
  return {
    ...defaultMetadata,
    alternates: {
      canonical: currentUrl
    },
    metadataBase: new URL(baseUrl)
  };
};