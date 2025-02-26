import { Metadata } from 'next'
import { notFound } from 'next/navigation'
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

    // Return fallback metadata for diagnosis
    if (!trade || !location) {
      console.error(`[DEBUG] Trade or location not found in generateMetadata: trade=${params.trade}, location=${params.location}`);
      return {
        title: 'Service Not Found | Top Contractors Denver',
        description: 'The requested service or location page could not be found.',
      }
    }

    return {
      title: `${trade.category_name} in ${location.subregion_name} | Top Contractors Denver`,
      description: `Find professional ${trade.category_name.toLowerCase()} in ${location.subregion_name}. Browse our directory of local ${trade.category_name.toLowerCase()} serving ${location.subregion_name} and surrounding areas.`,
    }
  } catch (error) {
    console.error('[DEBUG] Error generating metadata:', error);
    // Return fallback metadata rather than throwing notFound()
    return {
      title: 'Local Services | Top Contractors Denver',
      description: 'Find local services in the Denver metro area.',
    }
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

    // Return fallback page for diagnosis
    if (!trade || !location) {
      console.error(`[DEBUG] Trade or location not found in TradeLocationPage: trade=${params.trade}, location=${params.location}`);
      return (
        <main>
          <h1>Service Not Found</h1>
          <p>The requested service or location page could not be found.</p>
        </main>
      )
    }

    return (
      <main>
        <ServiceHero
          title={`${trade.category_name} in ${location.subregion_name}`}
          description={`Find professional ${trade.category_name.toLowerCase()} in ${location.subregion_name}. Browse our directory of local contractors serving your area.`}
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
      </main>
    )
  } catch (error) {
    console.error('[DEBUG] Error rendering trade location page:', error);
    // Return fallback page rather than throwing notFound()
    return (
      <main>
        <h1>Local Services</h1>
        <p>Find local services in the Denver metro area.</p>
      </main>
    )
  }
}
