import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateFAQSchema,
  generateBreadcrumbSchema
} from '@/utils/schema';

describe('Schema Generation', () => {
  describe('generateOrganizationSchema', () => {
    it('generates valid organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Top Contractors Denver');
      expect(schema.url).toBe('https://topcontractorsdenver.com');
      expect(schema.logo).toBe('https://top-contractors-1-20-25-git-html-rendering-vicsicards-projects.vercel.app/images/logo.png');
      expect(schema.description).toBe('Find the best local contractors in Denver. Compare verified reviews, ratings, and get free quotes.');
      expect(schema.address['@type']).toBe('PostalAddress');
      expect(schema.address.addressLocality).toBe('Denver');
      expect(schema.address.addressRegion).toBe('CO');
      expect(schema.contactPoint['@type']).toBe('ContactPoint');
      expect(schema.contactPoint.telephone).toBe('+1-303-555-0123');
      expect(Array.isArray(schema.sameAs)).toBe(true);
    });
  });

  describe('generateLocalBusinessSchema', () => {
    it('generates basic local business schema without trade', () => {
      const schema = generateLocalBusinessSchema({});

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('Top Contractors Denver');
      expect(schema.address['@type']).toBe('PostalAddress');
      expect(schema.geo['@type']).toBe('GeoCoordinates');
    });

    it('generates service schema with trade', () => {
      const schema = generateLocalBusinessSchema({ 
        trade: 'Plumbers',
        subregion: 'Denver Tech Center'
      });

      const serviceSchema = schema as {
        '@type': string;
        serviceType: string;
        provider: {
          '@type': string;
          name: string;
          aggregateRating: {
            '@type': string;
          };
        };
        description: string;
      };

      expect(serviceSchema['@type']).toBe('Service');
      expect(serviceSchema.serviceType).toBe('Plumbers');
      expect(serviceSchema.provider['@type']).toBe('LocalBusiness');
      expect(serviceSchema.provider.name).toBe('Plumbers in Denver');
      expect(serviceSchema.description).toContain('Denver Tech Center');
      expect(serviceSchema.provider.aggregateRating['@type']).toBe('AggregateRating');
    });

    it('includes review information', () => {
      const schema = generateLocalBusinessSchema({ trade: 'Plumbers' });

      expect(schema.review['@type']).toBe('Review');
      expect(schema.review.reviewRating['@type']).toBe('Rating');
      expect(schema.review.author['@type']).toBe('Person');
      expect(schema.review.itemReviewed['@type']).toBe('LocalBusiness');
    });
  });

  describe('generateFAQSchema', () => {
    it('generates valid FAQ schema', () => {
      const faqs = [
        {
          question: 'How much does it cost?',
          answer: 'Prices vary based on the project scope.'
        },
        {
          question: 'What areas do you serve?',
          answer: 'We serve the greater Denver area.'
        }
      ];

      const schema = generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(Array.isArray(schema.mainEntity)).toBe(true);
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });

    it('handles empty FAQ list', () => {
      const schema = generateFAQSchema([]);

      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(0);
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('generates basic breadcrumb with home only', () => {
      const schema = generateBreadcrumbSchema({});

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0].name).toBe('Home');
    });

    it('generates breadcrumb with trade', () => {
      const schema = generateBreadcrumbSchema({ trade: 'Plumbers' });

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[1].name).toBe('Plumbers');
      expect(schema.itemListElement[1].item).toBe('https://topcontractorsdenver.com/trades/plumbers');
    });

    it('generates complete breadcrumb with trade and subregion', () => {
      const schema = generateBreadcrumbSchema({
        trade: 'Plumbers',
        subregion: 'Denver Tech Center'
      });

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[2].name).toBe('Denver Tech Center');
      expect(schema.itemListElement[2].item).toBe('https://topcontractorsdenver.com/trades/plumbers/denver-tech-center');
    });

    it('handles spaces in trade and subregion names', () => {
      const schema = generateBreadcrumbSchema({
        trade: 'Bathroom Remodelers',
        subregion: 'Cherry Creek North'
      });

      expect(schema.itemListElement[1].item).toBe('https://topcontractorsdenver.com/trades/bathroom-remodelers');
      expect(schema.itemListElement[2].item).toBe('https://topcontractorsdenver.com/trades/bathroom-remodelers/cherry-creek-north');
    });
  });
});
