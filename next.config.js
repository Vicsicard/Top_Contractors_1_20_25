/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      'maps.googleapis.com',
      'maps.gstatic.com',
      'top-contractors-denver.ghost.io',
      'top-contractors-denver-1.ghost.io',
      'top-contractors-denver-2.ghost.io',
      '6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'top-contractors-denver-1.ghost.io',
        port: '',
        pathname: '/content/images/**',
      },
    ],
  },
};

module.exports = config;
