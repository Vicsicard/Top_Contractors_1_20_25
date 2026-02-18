import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ServiceHero } from '@/components/services/ServiceHero'
import { ServiceFAQs } from '@/components/services/ServiceFAQs'
import { ContractorCard } from '@/components/services/ContractorCard'
import { 
  getTradeBySlug,
  getSubregionBySlug, 
  getContractorsByTradeAndSubregion,
  getAllTrades,
  getAllSubregions 
} from '@/utils/database'
import { 
  generateLocalBusinessSchema, 
  generateBreadcrumbSchema,
  generateServiceSchema 
} from '@/utils/schema'
import { ChevronRight, MapPin, ArrowRight } from 'lucide-react'

interface Props {
  params: {
    trade: string
    location: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    console.log(`[DEBUG] Generating metadata for trade/location: ${params.trade}/${params.location}`);
    const [trade, location] = await Promise.all([
      getTradeBySlug(params.trade),
      getSubregionBySlug(params.location)
    ])

    if (!trade || !location) {
      console.error(`[DEBUG] Trade or location not found in generateMetadata: trade=${params.trade}, location=${params.location}`);
      notFound();
    }

    return {
      title: `${trade.category_name} in ${location.subregion_name}, CO | Top Contractors Denver`,
      description: `Find verified ${trade.category_name.toLowerCase()} in ${location.subregion_name}, CO. Compare local contractors, read reviews, and get free quotes. Serving ${location.subregion_name} and surrounding areas.`,
      alternates: {
        canonical: `https://topcontractorsdenver.com/services/${params.trade}/${params.location}/`,
      },
      openGraph: {
        type: 'website',
        url: `https://topcontractorsdenver.com/services/${params.trade}/${params.location}/`,
        title: `${trade.category_name} in ${location.subregion_name}, CO | Top Contractors Denver`,
        description: `Find verified ${trade.category_name.toLowerCase()} in ${location.subregion_name}, CO. Compare local contractors, read reviews, and get free quotes.`,
      },
    }
  } catch (error) {
    console.error('[DEBUG] Error generating metadata:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const trades = await getAllTrades()
    const locations = await getAllSubregions()
    
    return trades.flatMap(trade => 
      locations.map(location => ({
        trade: trade.slug,
        location: location.slug,
      }))
    )
  } catch (error) {
    console.error('Error generating static params:', error);
    return []
  }
}

export default async function TradeLocationPage({ params }: Props) {
  try {
    console.log(`[DEBUG] Rendering trade/location page: ${params.trade}/${params.location}`);
    const [trade, location, contractors] = await Promise.all([
      getTradeBySlug(params.trade),
      getSubregionBySlug(params.location),
      getContractorsByTradeAndSubregion(params.trade, params.location)
    ])

    if (!trade || !location) {
      console.error(`[DEBUG] Trade or location not found in TradeLocationPage: trade=${params.trade}, location=${params.location}`);
      notFound();
    }

    return (
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              generateLocalBusinessSchema(trade, location),
              generateBreadcrumbSchema(trade, location),
              generateServiceSchema(trade, location),
            ]),
          }}
        />

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href={`/services/${params.trade}`} className="hover:text-primary transition-colors">{trade.category_name}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">{location.subregion_name}</span>
          </div>
        </nav>

        <ServiceHero
          title={`${trade.category_name} in ${location.subregion_name}`}
          description={`Find verified ${trade.category_name.toLowerCase()} in ${location.subregion_name}, CO. Browse local contractors, compare ratings, and get free quotes.`}
        />

        {/* Contractors Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {trade.category_name} Serving {location.subregion_name}
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {contractors.map((contractor) => (
                <ContractorCard
                  key={contractor.id}
                  contractor={contractor}
                  trade={trade.category_name}
                  location={location.subregion_name}
                />
              ))}
            </div>

            {contractors.length === 0 && (
              <p className="text-center text-gray-600 mt-8">
                No contractors found for this area. Please try another location or contact us to list your business.
              </p>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <ServiceFAQs
          trade={trade.category_name}
          location={location.subregion_name}
        />

        {/* Internal link strip */}
        <div className="bg-white border-t border-gray-200 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

              {/* Back to trade hub */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Service Hub</p>
                <Link
                  href={`/services/${params.trade}`}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <ArrowRight size={13} className="rotate-180" />
                  All {trade.category_name} in Denver
                </Link>
              </div>

              {/* Location hub */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Location Hub</p>
                <Link
                  href={`/locations/${params.location}`}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <MapPin size={13} />
                  All Contractors in {location.subregion_name}
                </Link>
              </div>

              {/* Other locations for this trade */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{trade.category_name} Nearby</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {[
                    { label: 'Denver',      slug: 'denver' },
                    { label: 'Aurora',      slug: 'aurora' },
                    { label: 'Lakewood',    slug: 'lakewood' },
                    { label: 'Arvada',      slug: 'arvada' },
                    { label: 'Westminster', slug: 'westminster' },
                    { label: 'Thornton',    slug: 'thornton' },
                  ]
                    .filter((l) => l.slug !== params.location)
                    .slice(0, 5)
                    .map(({ label, slug }) => (
                      <Link
                        key={slug}
                        href={`/services/${params.trade}/${slug}`}
                        className="text-xs text-gray-500 hover:text-primary hover:underline transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    )
  } catch (error) {
    console.error('[DEBUG] Error rendering trade location page:', error);
    notFound();
  }
}
