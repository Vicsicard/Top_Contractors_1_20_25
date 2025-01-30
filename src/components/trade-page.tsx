'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from './breadcrumb';
import { FAQSection } from './FAQSection';
import { tradeFAQs } from '@/data/trade-faqs';
import { JsonLd } from './json-ld';

interface Props {
  trade: string;
  data: {
    category: {
      id: string;
      category_name: string;
      slug: string;
    };
    regions: Array<{
      id: string;
      region_name: string;
      slug: string;
    }>;
  };
}

export function TradePage({ data }: Props) {
  if (!data || !data.regions) {
    notFound();
  }

  return (
    <main>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Trades', href: '/trades' },
          { label: `${data.category.category_name} Contractors`, href: `/${data.category.slug}` }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {data.category.category_name} Contractors
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find trusted {data.category.category_name.toLowerCase()} contractors in your area
          </p>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Service Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.regions.map(region => (
          <Link 
            key={region.id} 
            href={`/${data.category.slug}/${region.slug}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              {region.region_name}
            </h2>
          </Link>
        ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {tradeFAQs[data.category.slug.toLowerCase()] && (
        <FAQSection
          faqs={tradeFAQs[data.category.slug.toLowerCase()]}
          category={data.category.category_name}
        />
      )}

      {/* Schema Markup */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${data.category.category_name} Contractors`,
          "serviceType": data.category.category_name,
          "areaServed": data.regions.map(region => ({
            "@type": "City",
            "name": region.region_name
          })),
          "provider": {
            "@type": "Organization",
            "name": "Top Contractors Denver"
          }
        }}
      />
    </main>
  );
}
