/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  experimental: {
    esmExternals: true,
    middleware: true,
    appDir: true
  },

  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,

  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB
  },

  images: {
    unoptimized: false,
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

  serverRuntimeConfig: {
    hmr: {
      protocol: 'ws',
      hostname: 'localhost',
      port: 3001
    }
  },

  async rewrites() {
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