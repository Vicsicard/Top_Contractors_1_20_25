import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ServiceHero } from '@/components/services/ServiceHero'
import { getTradeBySlug, getAllSubregions, getAllTrades } from '@/utils/database'

interface Props {
  params: {
    trade: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const trade = await getTradeBySlug(params.trade)
    
    if (!trade) {
      notFound()
    }

    return {
      title: `${trade.category_name} in Denver | Top Contractors Denver`,
      description: `Find ${trade.category_name.toLowerCase()} in the Denver metro area. Browse our directory of local ${trade.category_name.toLowerCase()} by location.`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const trades = await getAllTrades()
    
    return trades.map((trade) => ({
      trade: trade.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error);
    return []
  }
}

export default async function TradePage({ params }: Props) {
  try {
    const [trade, subregions] = await Promise.all([
      getTradeBySlug(params.trade),
      getAllSubregions(),
    ])

    if (!trade) {
      notFound()
    }

    // Generic trade descriptions
    const tradeDescriptions: Record<string, string> = {
      'Plumbers': 'Professional plumbing services for residential and commercial properties. From repairs and maintenance to new installations.',
      'Electricians': 'Licensed electrical services for homes and businesses. Including repairs, installations, and system upgrades.',
      'HVAC Contractors': 'Expert heating, ventilation, and air conditioning services. Installation, maintenance, and repairs.',
      'Roofers': 'Professional roofing services including repairs, replacements, and new installations.',
      'General Contractors': 'Comprehensive construction and renovation services for residential and commercial projects.',
      'Painters': 'Professional painting services for interior and exterior surfaces of homes and businesses.',
      'Landscapers': 'Landscape design, installation, and maintenance services for residential and commercial properties.',
      'Concrete Contractors': 'Expert concrete services including foundations, driveways, patios, and decorative concrete work.',
      'Drywall Contractors': 'Professional drywall installation, repair, and finishing services for walls and ceilings.',
      'Fencing Contractors': 'Quality fence installation and repair services for residential and commercial properties.',
      'Flooring Contractors': 'Expert installation and repair of various flooring types including hardwood, tile, carpet, and laminate.',
      'Garage Door Contractors': 'Professional installation, repair, and maintenance of garage doors and opener systems.',
      'Handyman Services': 'Reliable general repair and maintenance services for homes and small businesses.',
      'Siding Contractors': 'Expert installation and repair of various siding materials for homes and buildings.',
      'Tree Service Contractors': 'Professional tree removal, trimming, pruning, and general tree care services.',
      'Window Contractors': 'Expert window installation, replacement, and repair services for residential and commercial buildings.',
    }

    return (
      <main>
        <ServiceHero
          title={`${trade.category_name} in Denver`}
          description={`Find ${trade.category_name.toLowerCase()} in the Denver metro area. Browse our directory by location to find contractors near you.`}
        />

        {/* Service Description */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About {trade.category_name}
              </h2>
              <p className="text-lg text-gray-600">
                {tradeDescriptions[trade.category_name] || 
                  `Professional ${trade.category_name.toLowerCase()} serving the Denver metro area. Find experienced contractors for your project needs.`}
              </p>
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Browse by Location
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {subregions.map((subregion) => (
                <Link
                  key={subregion.id}
                  href={`/services/${params.trade}/${subregion.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {subregion.subregion_name}
                    </h3>
                    <p className="text-gray-600">
                      Find {trade.category_name.toLowerCase()} in {subregion.subregion_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('Error rendering trade page:', error);
    notFound()
  }
}
