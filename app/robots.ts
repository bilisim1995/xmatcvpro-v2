import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/search'],
      disallow: ['/api/*', '/admin/*'],
    },
    sitemap: 'https://xmatch.pro/sitemap.xml',
  };
}