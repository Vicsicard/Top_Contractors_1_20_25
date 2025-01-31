interface SchemaParams {
  trade?: string;
  subregion?: string;
  isHomePage?: boolean;
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Top Contractors Denver',
    url: 'https://topcontractorsdenver.com',
    logo: 'https://top-contractors-1-20-25-git-html-rendering-vicsicards-projects.vercel.app/images/logo.png',
    description: 'Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Denver',
      addressRegion: 'CO',
      postalCode: '80202',
      addressCountry: 'US'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-303-555-0123',
      contactType: 'customer service',
      areaServed: 'Denver Metropolitan Area',
      availableLanguage: ['English', 'Spanish']
    },
    sameAs: [
      'https://www.facebook.com/topcontractorsdenver',
      'https://twitter.com/denvercontractor',
      'https://www.linkedin.com/company/top-contractors-denver'
    ]
  };
}

export function generateLocalBusinessSchema({ trade, subregion }: SchemaParams) {
  const businessName = trade ? `${trade} in Denver` : 'Top Contractors Denver';
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName,
    description: trade 
      ? `Find the best ${trade.toLowerCase()} in ${subregion ? `${subregion}, ` : ''}Denver. Compare local contractors, read verified reviews, and get free quotes.`
      : 'Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.',
    url: 'https://topcontractorsdenver.com',
    telephone: '+1-303-555-0123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1234 Market Street',
      addressLocality: 'Denver',
      addressRegion: 'CO',
      postalCode: '80202',
      addressCountry: 'US'
    },
    areaServed: {
      '@type': 'City',
      name: 'Denver',
      '@id': 'https://www.wikidata.org/wiki/Q16554'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.7392,
      longitude: -104.9903
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.8',
        bestRating: '5',
        worstRating: '1'
      },
      author: {
        '@type': 'Person',
        name: 'Top Contractors Denver'
      },
      itemReviewed: {
        '@type': 'LocalBusiness',
        name: businessName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1234 Market Street',
          addressLocality: 'Denver',
          addressRegion: 'CO',
          postalCode: '80202',
          addressCountry: 'US'
        }
      }
    }
  };

  const schemaWithService = trade ? {
    ...baseSchema,
    '@type': 'Service',
    serviceType: trade,
    provider: {
      '@type': 'LocalBusiness',
      name: businessName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1234 Market Street',
        addressLocality: 'Denver',
        addressRegion: 'CO',
        postalCode: '80202',
        addressCountry: 'US'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1'
      }
    }
  } : baseSchema;

  return schemaWithService;
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema({ trade, subregion }: SchemaParams) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://topcontractorsdenver.com'
    }
  ];

  if (trade) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: trade,
      item: `https://topcontractorsdenver.com/trades/${trade.toLowerCase().replace(/ /g, '-')}`
    });
  }

  if (subregion) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: subregion,
      item: `https://topcontractorsdenver.com/trades/${trade?.toLowerCase().replace(/ /g, '-')}/${subregion.toLowerCase().replace(/ /g, '-')}`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
}
