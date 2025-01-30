/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ],
      }
    ];
  },
  images: {
    domains: [
      'maps.googleapis.com',
      'maps.gstatic.com',
      'bmiyyaexngxbrzkyqgzk.supabase.co', 
      '6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io',
      'img.youtube.com',
      'www.youtube.com',
      'youtube.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'top-contractors-denver-1.ghost.io',
        port: '',
        pathname: '/content/images/**',
      },
      {
        protocol: 'https',
        hostname: 'top-contractors-denver-2.ghost.io',
        port: '',
        pathname: '/content/images/**',
      },
    ],
  },
};

module.exports = config;
