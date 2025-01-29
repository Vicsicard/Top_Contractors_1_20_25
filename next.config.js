/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    domains: [
      'maps.googleapis.com',
      'maps.gstatic.com',
      'bmiyyaexngxbrzkyqgzk.supabase.co', 
      '6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io',
      'img.youtube.com'
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
