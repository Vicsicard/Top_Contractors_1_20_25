import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTrades } from '@/utils/database';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'All Trade Services | Top Contractors Denver',
  description: 'Explore our comprehensive list of trade services in Denver. From home remodeling to specialized repairs, find the right contractor for your project.',
  alternates: {
    canonical: '/trades',
  }
};

interface TradeCategory {
  title: string;
  trades: Array<{
    name: string;
    slug: string;
    description: string;
  }>;
}

const tradeCategories: TradeCategory[] = [
  {
    title: 'Remodeling',
    trades: [
      { 
        name: 'Home Remodeling',
        slug: 'home-remodeling',
        description: 'Complete home renovation and remodeling services'
      },
      { 
        name: 'Bathroom Remodeling',
        slug: 'bathroom-remodeling',
        description: 'Expert bathroom renovation and upgrades'
      },
      { 
        name: 'Kitchen Remodeling',
        slug: 'kitchen-remodeling',
        description: 'Professional kitchen renovation services'
      }
    ]
  },
  {
    title: 'Exterior',
    trades: [
      { 
        name: 'Siding & Gutters',
        slug: 'siding-and-gutters',
        description: 'Siding installation and gutter services'
      },
      { 
        name: 'Roofing',
        slug: 'roofing',
        description: 'Roof repair and replacement services'
      },
      { 
        name: 'Windows',
        slug: 'windows',
        description: 'Window installation and replacement'
      },
      { 
        name: 'Fencing',
        slug: 'fencing',
        description: 'Fence installation and repair services'
      }
    ]
  },
  {
    title: 'Systems',
    trades: [
      { 
        name: 'Plumbing',
        slug: 'plumbing',
        description: 'Professional plumbing services'
      },
      { 
        name: 'Electrical',
        slug: 'electrical',
        description: 'Licensed electrical services'
      },
      { 
        name: 'HVAC',
        slug: 'hvac',
        description: 'Heating, ventilation, and air conditioning services'
      }
    ]
  },
  {
    title: 'Specialty',
    trades: [
      { 
        name: 'Painting',
        slug: 'painting',
        description: 'Interior and exterior painting services'
      },
      { 
        name: 'Landscaping',
        slug: 'landscaping',
        description: 'Professional landscaping and yard services'
      },
      { 
        name: 'Masonry',
        slug: 'masonry',
        description: 'Expert masonry and stonework services'
      },
      { 
        name: 'Decks',
        slug: 'decks',
        description: 'Deck building and repair services'
      },
      { 
        name: 'Flooring',
        slug: 'flooring',
        description: 'Flooring installation and repair'
      },
      { 
        name: 'Epoxy Garage',
        slug: 'epoxy-garage',
        description: 'Garage floor epoxy coating services'
      }
    ]
  }
];

export default async function TradesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Trades', href: '/trades' }
        ]}
      />
      
      <h1 className="text-4xl font-bold mb-8">Trade Services in Denver</h1>
      
      <p className="text-lg mb-8">
        Explore our comprehensive list of trade services available in the Denver area. 
        Our verified contractors specialize in various trades to meet all your home improvement needs.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {tradeCategories.map((category) => (
          <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-4">
              {category.trades.map((trade) => (
                <div key={trade.slug} className="border-b pb-4 last:border-b-0">
                  <Link 
                    href={`/trades/${trade.slug}`}
                    className="group"
                  >
                    <h3 className="text-xl font-medium text-primary group-hover:text-accent-warm transition-colors">
                      {trade.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {trade.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
