/** @type {import('next').NextConfig} */

// Build türünü ENV ile belirle (örneğin: export veya server)
const isExport = process.env.EXPORT_BUILD === 'true';

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  output: 'standalone',
  experimental: {
    esmExternals: true,
    middleware: !isExport,  // middleware export modunda çalışmaz
    appDir: true
  },

  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB
  },

  output: isExport ? 'export' : undefined,

  images: {
    unoptimized: isExport ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.xmatch.pro',
        pathname: '/images/**'
      }
    ]
  },

  trailingSlash: false,

  serverRuntimeConfig: !isExport
    ? {
        hmr: {
          protocol: 'ws',
          hostname: 'localhost',
          port: 3001
        }
      }
    : undefined,

  // rewrites ve headers export modunda kullanılmaz!
  async rewrites() {
    if (isExport) return [];
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/models/:slug',
        destination: '/models/:slug'
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },

  async headers() {
    if (isExport) return [];
    return [
      {
        source: '/api/models/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, must-revalidate' }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  compress: true,
  poweredByHeader: false
};

module.exports = nextConfig;
