import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/404',
          '/500'
        ],
      }
    ],
    sitemap: [
      'https://topcontractorsdenver.com/sitemap.xml',
      'https://topcontractorsdenver.com/sitemap-blog.xml',
      'https://topcontractorsdenver.com/sitemap-static.xml',
      'https://topcontractorsdenver.com/sitemap-trades.xml',
      'https://topcontractorsdenver.com/sitemap-videos.xml'
    ],
    host: 'https://topcontractorsdenver.com',
  }
}
