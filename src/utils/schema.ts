interface SchemaParams {
  trade?: any;
  location?: any;
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

export function generateLocalBusinessSchema(trade: any, location: any) {
  const businessName = trade ? `${trade.category_name} in ${location.subregion_name}` : 'Top Contractors Denver';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName,
    description: trade 
      ? `Find professional ${trade.category_name.toLowerCase()} in ${location.subregion_name}. Browse our directory of local ${trade.category_name.toLowerCase()} serving ${location.subregion_name} and surrounding areas.`
      : 'Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.',
    url: `https://topcontractorsdenver.com/services/${trade.slug}/${location.slug}/`,
    telephone: '+1-303-555-0123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1234 Market Street',
      addressLocality: 'Denver',
      addressRegion: 'CO',
      postalCode: '80202',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.7392,
      longitude: -104.9903
    },
    areaServed: {
      '@type': 'City',
      name: location.subregion_name,
      containedInPlace: {
        '@type': 'State',
        name: 'Colorado'
      }
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '17:00'
      }
    ],
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'USD'
  };
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

export function generateBreadcrumbSchema(trade: any, location: any) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://topcontractorsdenver.com/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Services',
      item: 'https://topcontractorsdenver.com/services/'
    }
  ];

  if (trade) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: trade.category_name,
      item: `https://topcontractorsdenver.com/services/${trade.slug}/`
    });
  }

  if (location) {
    items.push({
      '@type': 'ListItem',
      position: 4,
      name: location.subregion_name,
      item: `https://topcontractorsdenver.com/services/${trade.slug}/${location.slug}/`
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  };
}

export function generateServiceSchema(trade: any, location: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: trade.category_name,
    name: `${trade.category_name} in ${location.subregion_name}`,
    description: `Professional ${trade.category_name.toLowerCase()} services in ${location.subregion_name}. Our verified contractors provide high-quality work with reliable service.`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Top Contractors Denver',
      image: 'https://topcontractorsdenver.com/images/logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.subregion_name,
        addressRegion: 'CO',
        addressCountry: 'US'
      }
    },
    areaServed: {
      '@type': 'City',
      name: location.subregion_name
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${trade.category_name} Services`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${trade.category_name} Installation`
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${trade.category_name} Repair`
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${trade.category_name} Maintenance`
          }
        }
      ]
    }
  };
}

export function generateBlogPostSchema(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta_description || '',
    image: post.feature_image || 'https://topcontractorsdenver.com/images/denver sky 666.jpg',
    url: `https://topcontractorsdenver.com/blog/${post.slug}/`,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.primary_author?.name || 'Top Contractors Denver',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Top Contractors Denver',
      logo: {
        '@type': 'ImageObject',
        url: 'https://topcontractorsdenver.com/images/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://topcontractorsdenver.com/blog/${post.slug}/`
    },
    keywords: post.tags?.map((tag: any) => tag.name).join(', ') || post.primary_tag?.name || '',
    articleBody: post.plaintext || ''
  };
}
