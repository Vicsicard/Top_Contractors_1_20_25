import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SubregionList } from '@/components/SubregionList';
import { getAllSubregions, getTradeBySlug } from '@/utils/database';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/utils/schema';
import { Breadcrumb } from '@/components/breadcrumb';
import { FAQSection } from '@/components/FAQSection';
import { getFAQsForTrade } from '@/data/faqs';

export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = await getTradeBySlug(params.slug);
  
  if (!trade) {
    throw new Error('Trade not found');
  }

  const tradeName = trade.category_name;

  const title = `${tradeName} in Denver | Find Local Contractors`;
  const description = `Find trusted ${tradeName} in the Denver area. Compare verified reviews, get free quotes, and connect with the best local contractors.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default async function TradePage({ params }: Props) {
  const trade = await getTradeBySlug(params.slug);
  if (!trade) {
    notFound();
  }

  const tradeName = trade.category_name;
  const faqs = getFAQsForTrade(tradeName);
  
  const schema = {
    localBusiness: generateLocalBusinessSchema({ trade: tradeName }),
    breadcrumb: generateBreadcrumbSchema({ trade: tradeName }),
    faq: generateFAQSchema(faqs)
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: tradeName, href: `/trades/${params.slug}` }
  ];

  const subregions = await getAllSubregions();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="py-8">
          <h1 className="text-4xl font-bold mb-4">{tradeName}</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find the best {tradeName.toLowerCase()} in Denver. Compare verified reviews, 
            ratings, and get free quotes from top local contractors.
          </p>

          <SubregionList 
            subregions={subregions} 
            tradeSlug={trade.slug} 
            tradeName={trade.category_name} 
          />
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Why Choose Our {tradeName}?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Verified Reviews</h3>
                <p className="text-gray-600">All reviews are from real customers who have used our services.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Licensed & Insured</h3>
                <p className="text-gray-600">Every contractor is properly licensed and fully insured for your protection.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Free Quotes</h3>
                <p className="text-gray-600">Get competitive quotes from multiple contractors at no cost to you.</p>
              </div>
            </div>
          </section>

          <FAQSection 
            faqs={faqs} 
            title={`Frequently Asked Questions About ${tradeName} in Denver`}
          />
        </div>
      </div>
    </>
  );
}
