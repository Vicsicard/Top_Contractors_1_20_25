import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ServiceHero } from '@/components/services/ServiceHero'
import { getAllTrades } from '@/utils/database'
import {
  Wrench, Zap, Wind, Home, HardHat, Paintbrush, Leaf,
  Building2, Layers, SeparatorHorizontal, LayoutGrid,
  DoorOpen, Hammer, PanelTop, TreePine, AppWindow
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contractor Services | Top Contractors Denver',
  description: 'Find local contractors in Denver for plumbing, electrical, HVAC, and more. Browse our directory of professional contractors serving the Denver metro area.',
}

const TRADE_ICONS: Record<string, React.ElementType> = {
  'Plumbers': Wrench,
  'Electricians': Zap,
  'HVAC Contractors': Wind,
  'Roofers': Home,
  'General Contractors': HardHat,
  'Painters': Paintbrush,
  'Landscapers': Leaf,
  'Concrete Contractors': Building2,
  'Drywall Contractors': Layers,
  'Fencing Contractors': SeparatorHorizontal,
  'Flooring Contractors': LayoutGrid,
  'Garage Door Contractors': DoorOpen,
  'Handyman Services': Hammer,
  'Siding Contractors': PanelTop,
  'Tree Service Contractors': TreePine,
  'Window Contractors': AppWindow,
}

function TradeIcon({ name }: { name: string }) {
  const Icon = TRADE_ICONS[name] || Hammer
  return (
    <div className="p-2.5 bg-blue-50 rounded-lg text-primary mr-4 flex-shrink-0">
      <Icon size={24} strokeWidth={1.75} />
    </div>
  )
}

export default async function ServicesPage() {
  const trades = await getAllTrades()

  return (
    <main>
      <ServiceHero
        title="Find Local Contractors in Denver"
        description="Browse our directory of professional contractors serving the Denver metro area"
      />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Service
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => (
              <Link
                key={trade.id}
                href={`/services/${trade.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <TradeIcon name={trade.category_name} />
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {trade.category_name}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Find {trade.category_name.toLowerCase()} in the Denver metro area
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
