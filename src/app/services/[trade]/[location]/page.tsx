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
    const [trade, location] = await Promise.all([
      getTradeBySlug(params.trade),
      getSubregionBySlug(params.location)
    ])

    if (!trade || !location) {
      // Use notFound() instead of returning metadata for non-existent pages
      notFound()
    }

    return {
      title: `${trade.category_name} in ${location.subregion_name} | Top Contractors Denver`,
      description: `Find professional ${trade.category_name.toLowerCase()} in ${location.subregion_name}. Browse our directory of local ${trade.category_name.toLowerCase()} serving ${location.subregion_name} and surrounding areas.`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Use notFound() for error cases as well
    notFound()
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
    const [trade, location, contractors] = await Promise.all([
      getTradeBySlug(params.trade),
      getSubregionBySlug(params.location),
      getContractorsByTradeAndSubregion(params.trade, params.location)
    ])

    if (!trade || !location) {
      notFound()
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
    console.error('Error rendering trade location page:', error);
    notFound()
  }
}
