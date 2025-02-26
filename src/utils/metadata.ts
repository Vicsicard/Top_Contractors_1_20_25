import { Metadata } from 'next';

interface MetadataParams {
  trade?: string;
  subregion?: string;
}

export function generateMetadata({ trade, subregion }: MetadataParams): Metadata {
  const baseTitle = "Top Contractors Denver";
  const cityName = "Denver";
  
  let title = baseTitle;
  let description = `Find the best local contractors in ${cityName}. Verified reviews, ratings, and contact information.`;
  
  if (trade && subregion) {
    title = `Top ${trade} in ${subregion}, ${cityName} | Verified Reviews & Ratings`;
    description = `Find the best ${trade.toLowerCase()} in ${subregion}, ${cityName}. Compare local contractors, read verified reviews, and get free quotes. Top-rated ${trade.toLowerCase()} serving ${subregion} area.`;
  } else if (trade) {
    title = `Best ${trade} in ${cityName} | Compare Local Contractors`;
    description = `Looking for ${trade.toLowerCase()} in ${cityName}? Compare top-rated local contractors, read verified reviews, and get free quotes. Serving all ${cityName} metro areas.`;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: baseTitle,
    url: 'https://topcontractorsdenver.com',
    logo: 'https://topcontractorsdenver.com/logo.png',
    sameAs: [
      'https://www.facebook.com/topcontractorsdenver',
      'https://twitter.com/denvercontractor',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-303-555-0123',
      contactType: 'customer service',
      areaServed: 'Denver Metropolitan Area',
      availableLanguage: ['English', 'Spanish']
    }
  };

  return {
    title,
    description,
    keywords: generateKeywords({ trade, subregion }),
    openGraph: {
      title,
      description,
      url: 'https://topcontractorsdenver.com',
      siteName: baseTitle,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@denvercontractor',
    },
    alternates: {
      canonical: generateCanonicalUrl({ trade, subregion }),
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
    },
    other: {
      schema: JSON.stringify(schema),
    },
  };
}

function generateKeywords({ trade, subregion }: MetadataParams): string {
  const baseKeywords = ['contractors', 'Denver', 'home improvement', 'local contractors'];
  
  if (trade && subregion) {
    return `${trade}, ${subregion}, Denver ${trade.toLowerCase()}, best ${trade.toLowerCase()}, top ${trade.toLowerCase()}, ${trade.toLowerCase()} near me, ${subregion} ${trade.toLowerCase()}, Denver metro ${trade.toLowerCase()}, local ${trade.toLowerCase()}, verified ${trade.toLowerCase()}, ${trade.toLowerCase()} reviews, ${trade.toLowerCase()} ratings`;
  }
  
  return baseKeywords.join(', ');
}

function generateCanonicalUrl({ trade, subregion }: MetadataParams): string {
  const baseUrl = 'https://topcontractorsdenver.com';
  
  if (trade && subregion) {
    return `${baseUrl}/trades/${trade.toLowerCase()}/${subregion.toLowerCase()}/`;
  } else if (trade) {
    return `${baseUrl}/trades/${trade.toLowerCase()}/`;
  }
  
  return `${baseUrl}/`;
}
