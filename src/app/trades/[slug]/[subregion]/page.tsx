import { notFound } from 'next/navigation';
import { Metadata, Viewport } from 'next';
import { ContractorList } from '@/components/ContractorList';
import {
  getTradeBySlug,
  getSubregionBySlug,
  getAllTrades,
  getAllSubregions,
  getContractorsByTradeAndSubregion
} from '@/utils/database';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/utils/schema';
import Breadcrumb from '@/components/breadcrumb';
import { FAQSection } from '@/components/FAQSection';
import { getFAQsForTrade } from '@/data/faqs';

interface Props {
  params: { 
    slug: string;
    subregion: string;
  }
}

// This helps Next.js understand our dynamic routes
export async function generateStaticParams() {
  try {
    console.log('[SERVER] Fetching trades and subregions for static paths...');
    const [trades, subregions] = await Promise.all([
      getAllTrades(),
      getAllSubregions(),
    ]);
    
    console.log('[SERVER] Found trades:', trades.length);
    console.log('[SERVER] Found subregions:', subregions.length);
    
    const paths = [];
    for (const trade of trades) {
      for (const subregion of subregions) {
        // Validate that both trade and subregion have required fields
        if (!trade.slug || !subregion.slug) {
          console.warn('[SERVER] Invalid trade or subregion data:', { trade, subregion });
          continue;
        }
        
        paths.push({
          slug: trade.slug,
          subregion: subregion.slug,
        });
      }
    }
    
    console.log('[SERVER] Generated paths count:', paths.length);
    return paths;
  } catch (error) {
    console.error('[SERVER] Error generating static params:', error);
    // Return empty array instead of throwing to allow build to continue
    return [];
  }
}

async function getTradeAndSubregionNames({ slug, subregion }: Props['params']) {
  try {
    console.log('[SERVER] Fetching trade and subregion data:', { slug, subregion });
    const [trade, subregionData] = await Promise.all([
      getTradeBySlug(slug),
      getSubregionBySlug(subregion)
    ]);

    if (!trade || !subregionData) {
      console.error('[SERVER] Trade or subregion not found:', { trade, subregionData });
      throw new Error('Trade or subregion not found');
    }

    if (!trade.category_name || !subregionData.subregion_name) {
      console.error('[SERVER] Invalid trade or subregion data:', { trade, subregionData });
      throw new Error('Invalid trade or subregion data');
    }

    return {
      tradeName: trade.category_name,
      subregionName: subregionData.subregion_name,
    };
  } catch (error) {
    console.error('[SERVER] Error in getTradeAndSubregionNames:', error);
    throw error;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tradeName, subregionName } = await getTradeAndSubregionNames(params);

  const title = `${tradeName} in ${subregionName} | Top Local Contractors`;
  const description = `Find trusted ${tradeName} in ${subregionName}. Compare verified reviews, get free quotes, and connect with the best local contractors.`;

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }],
};

export default async function TradeSubregionPage({ params }: Props) {
  if (!params?.slug || !params?.subregion) {
    console.error('[SERVER] Missing required params:', params);
    notFound();
  }

  const [trade, subregion] = await Promise.all([
    getTradeBySlug(params.slug),
    getSubregionBySlug(params.subregion)
  ]);

  if (!trade || !subregion) {
    notFound();
  }

  const tradeName = trade.category_name;
  const subregionName = subregion.subregion_name;
  const faqs = getFAQsForTrade(tradeName);

  // Fetch contractors for this trade and subregion
  const contractors = await getContractorsByTradeAndSubregion(params.slug, params.subregion);

  const schema = {
    localBusiness: generateLocalBusinessSchema({ trade: tradeName, subregion: subregionName }),
    breadcrumb: generateBreadcrumbSchema({ trade: tradeName, subregion: subregionName }),
    faq: generateFAQSchema(faqs)
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: tradeName, href: `/trades/${params.slug}` },
    { label: subregionName, href: `/trades/${params.slug}/${params.subregion}` }
  ];

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
          <h1 className="text-4xl font-bold mb-4">
            Top {tradeName} in {subregionName}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find the best {tradeName.toLowerCase()} serving {subregionName}. Compare verified reviews, 
            ratings, and get free quotes from top local contractors in your area.
          </p>

          <ContractorList 
            contractors={contractors}
            tradeName={tradeName}
            subregionName={subregionName}
          />
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Why Choose Our {tradeName} in {subregionName}?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
                <p className="text-gray-600">Our contractors are familiar with {subregionName} building codes and regulations.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Quality Guaranteed</h3>
                <p className="text-gray-600">All work is backed by our satisfaction guarantee and proper insurance coverage.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Competitive Pricing</h3>
                <p className="text-gray-600">Get multiple quotes to ensure you&apos;re getting the best value for your project.</p>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 mb-4">
              Looking for professional {tradeName} in {subregionName}? You&apos;re in the right place! We connect you with top-rated contractors who deliver exceptional results.
            </p>
          </div>

          <FAQSection 
            faqs={faqs} 
            category={tradeName}
          />
        </div>
      </div>
    </>
  );
}
