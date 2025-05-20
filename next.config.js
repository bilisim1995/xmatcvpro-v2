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
      
        headScripts: [
          {
            src: 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js',
            async: true,
          },
        ],
      
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
              pathname: '/**' // Changed from '/images/**' to '/**'
            }
          ],
          dangerouslyAllowSVG: true,
          contentDispositionType: 'attachment',
          minimumCacheTTL: 60
        },
      
        trailingSlash: false,
      
        serverRuntimeConfig: {
          hmr: {
            protocol: 'ws',
            hostname: 'localhost',
            port: 3001
          }
        },
        async headers() {
          return [
            {
              // Apply these headers to all routes in your application.
              source: '/:path*',
              headers: [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload'
                },
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff'
                },
                {
                  key: 'X-Frame-Options',
                  value: 'SAMEORIGIN'
                },
                {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block'
                },
                {
                  key: 'Referrer-Policy',
                  value: 'origin-when-cross-origin'
                },
                {
                  key: 'Permissions-Policy',
                  value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
                }
              ]
            },
            {
              source: '/api/:path*',
              headers: [
                { key: 'Access-Control-Allow-Credentials', value: 'true' },
                { key: 'Access-Control-Allow-Origin', value: '*' }, // Bu, geliştirme için '*' olabilir, canlıda daha kısıtlı olmalı
                { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
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
      };
      
      module.exports = nextConfig;
      