import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllSubregions,
  getSubregionBySlug,
  getAllTrades,
  getContractorsByTradeAndSubregion,
} from '@/utils/database';
import {
  MapPin, ArrowRight, ChevronRight, BadgeCheck, Star,
  Bath, Zap, Wind, Paintbrush, Hammer, Layers, Blocks,
  DoorOpen, AppWindow, LayoutGrid, Leaf, Wrench, HardHat,
  SeparatorHorizontal, Home
} from 'lucide-react';

interface Props {
  params: { subregion: string };
}

const TRADE_ICONS: Record<string, React.ElementType> = {
  'bathroom-remodeling': Bath,
  'deck-builders': Layers,
  'electricians': Zap,
  'epoxy-garage-flooring': LayoutGrid,
  'fencing-contractors': SeparatorHorizontal,
  'flooring-contractors': LayoutGrid,
  'home-remodeling': Home,
  'hvac-contractors': Wind,
  'kitchen-remodeling': Hammer,
  'landscaping-contractors': Leaf,
  'masonry-contractors': Blocks,
  'painting-contractors': Paintbrush,
  'plumbing-contractors': Wrench,
  'roofing-contractors': HardHat,
  'siding-contractors': AppWindow,
  'window-contractors': DoorOpen,
};

export async function generateStaticParams() {
  try {
    const subregions = await getAllSubregions();
    return subregions.map((s) => ({ subregion: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const subregion = await getSubregionBySlug(params.subregion);
    if (!subregion) return { title: 'Location Not Found' };

    return {
      title: `Contractors in ${subregion.subregion_name}, CO | Top Contractors Denver`,
      description: `Find verified local contractors in ${subregion.subregion_name}, Colorado. Browse roofing, plumbing, HVAC, remodeling, and more. Get free quotes from trusted pros.`,
      alternates: {
        canonical: `https://topcontractorsdenver.com/locations/${subregion.slug}`,
      },
      openGraph: {
        title: `Contractors in ${subregion.subregion_name}, CO | Top Contractors Denver`,
        description: `Find verified local contractors in ${subregion.subregion_name}, Colorado. Browse roofing, plumbing, HVAC, remodeling, and more. Get free quotes from trusted pros.`,
        url: `https://topcontractorsdenver.com/locations/${subregion.slug}`,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Location Not Found' };
  }
}

export default async function LocationHubPage({ params }: Props) {
  try {
    const [subregion, trades] = await Promise.all([
      getSubregionBySlug(params.subregion),
      getAllTrades(),
    ]);

    if (!subregion) notFound();

    // Fetch contractor counts per trade for this subregion
    const tradeCounts = await Promise.all(
      trades.map(async (trade) => {
        const contractors = await getContractorsByTradeAndSubregion(trade.slug, subregion.slug);
        return { trade, count: contractors.length };
      })
    );

    const totalContractors = tradeCounts.reduce((sum, t) => sum + t.count, 0);
    const activeTrades = tradeCounts.filter((t) => t.count > 0);

    const locationSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Contractors in ${subregion.subregion_name}, CO`,
      description: `Find verified local contractors in ${subregion.subregion_name}, Colorado for home improvement, remodeling, and repair projects.`,
      url: `https://topcontractorsdenver.com/locations/${subregion.slug}`,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://topcontractorsdenver.com/' },
          { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://topcontractorsdenver.com/locations/' },
          { '@type': 'ListItem', position: 3, name: subregion.subregion_name, item: `https://topcontractorsdenver.com/locations/${subregion.slug}` },
        ]
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
        />

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/locations" className="hover:text-primary transition-colors">Locations</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">{subregion.subregion_name}</span>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
              <MapPin size={16} />
              <span>{subregion.subregion_name}, Colorado</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Contractors in {subregion.subregion_name}, CO
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-2xl">
              Find verified local contractors in {subregion.subregion_name} for home improvement, remodeling, and repair projects.
              Browse {totalContractors > 0 ? `${totalContractors}+ verified` : 'trusted'} professionals across all major trades.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mb-8">
              {totalContractors > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full border border-blue-100">
                  <BadgeCheck size={15} />
                  {totalContractors}+ Verified Contractors
                </div>
              )}
              <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
                <Star size={15} />
                Free Quotes Available
              </div>
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full border border-orange-100">
                <MapPin size={15} />
                Serving {subregion.subregion_name} &amp; Surrounding Areas
              </div>
            </div>

            <a
              href={`/get-a-quote?location=${encodeURIComponent(subregion.subregion_name)}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Free Quotes in {subregion.subregion_name} <ArrowRight size={18} />
            </a>
          </div>
        </section>

        {/* About this location */}
        <section className="bg-white border-t border-gray-100 py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
              Home Services in {subregion.subregion_name}, Colorado
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3">
              {subregion.subregion_name} is one of the most sought-after communities in the Denver metro area,
              with a growing base of homeowners investing in home improvement and renovation projects.
              Whether you need a roof replacement, kitchen remodel, HVAC service, or landscaping upgrade,
              our network of verified contractors in {subregion.subregion_name} is ready to help.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              All contractors in our {subregion.subregion_name} directory are vetted for licensing,
              insurance, and customer satisfaction. Browse by service category below, compare ratings,
              and request free quotes directly from local professionals who know the area.
            </p>
          </div>
        </section>

        {/* Trade grid */}
        <section className="py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Find Contractors by Service in {subregion.subregion_name}
            </h2>
            <p className="text-gray-500 text-sm mb-10">
              Browse all available contractor categories serving {subregion.subregion_name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tradeCounts.map(({ trade, count }) => {
                const Icon = TRADE_ICONS[trade.slug] || Home;
                return (
                  <Link
                    key={trade.slug}
                    href={`/services/${trade.slug}/${subregion.slug}`}
                    className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="p-2.5 bg-blue-50 rounded-xl text-primary flex-shrink-0 group-hover:bg-blue-100 transition-colors duration-200">
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-primary text-sm leading-snug mb-1 transition-colors duration-200">
                        {trade.category_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {count > 0 ? `${count} contractor${count !== 1 ? 's' : ''} available` : 'Request a quote'}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured contractors (top rated across all trades) */}
        {activeTrades.length > 0 && (
          <section className="bg-white border-t border-gray-100 py-14 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                Top-Rated Contractors in {subregion.subregion_name}
              </h2>
              <p className="text-gray-500 text-sm mb-10">
                Highly rated professionals serving {subregion.subregion_name} and surrounding areas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeTrades.slice(0, 6).map(({ trade }) => (
                  <Link
                    key={trade.slug}
                    href={`/services/${trade.slug}/${subregion.slug}`}
                    className="group flex flex-col p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-primary text-sm mb-1 transition-colors duration-200">
                      {trade.category_name} in {subregion.subregion_name}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Verified contractors serving your area
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-auto">
                      View Contractors <ArrowRight size={11} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-10 text-center">
              FAQs About Hiring Contractors in {subregion.subregion_name}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `How do I find a reliable contractor in ${subregion.subregion_name}?`,
                  a: `Browse our verified directory of contractors serving ${subregion.subregion_name}. Each contractor is vetted for licensing and insurance. You can compare ratings, read reviews, and request free quotes directly through our platform.`,
                },
                {
                  q: `Are contractors in ${subregion.subregion_name} licensed and insured?`,
                  a: `Yes. All contractors listed in our ${subregion.subregion_name} directory are required to hold valid Colorado state licensing and carry appropriate insurance coverage before being listed on our platform.`,
                },
                {
                  q: `What types of contractors are available in ${subregion.subregion_name}?`,
                  a: `We cover all major trades in ${subregion.subregion_name} including roofing, plumbing, HVAC, electrical, kitchen remodeling, bathroom remodeling, flooring, painting, landscaping, fencing, windows, siding, and general contracting.`,
                },
                {
                  q: `How much does it cost to hire a contractor in ${subregion.subregion_name}?`,
                  a: `Project costs vary by scope and trade. Getting quotes through our platform is completely free with no obligation. Submit your project details and receive competitive quotes from multiple verified contractors in ${subregion.subregion_name}.`,
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">{q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-blue-900 py-16 px-4 text-center" style={{ backgroundColor: '#0f1f4a' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Find Contractors in {subregion.subregion_name} Today
            </h2>
            <p className="text-blue-200 text-sm sm:text-base mb-8">
              Free quotes from verified local professionals. No obligation, no pressure.
            </p>
            <a
              href={`/get-a-quote?location=${encodeURIComponent(subregion.subregion_name)}`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-dark font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
            >
              Get Free Quotes <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* Internal link strip — other locations */}
        <div className="bg-white border-t border-gray-200 py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs text-gray-400 text-center mb-4">Find contractors in other Denver metro areas</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {[
                { label: 'Denver Contractors',      href: '/locations/denver' },
                { label: 'Aurora Contractors',      href: '/locations/aurora' },
                { label: 'Lakewood Contractors',    href: '/locations/lakewood' },
                { label: 'Arvada Contractors',      href: '/locations/arvada' },
                { label: 'Westminster Contractors', href: '/locations/westminster' },
                { label: 'Thornton Contractors',    href: '/locations/thornton' },
                { label: 'Centennial Contractors',  href: '/locations/centennial' },
                { label: 'Littleton Contractors',   href: '/locations/littleton' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="text-xs text-gray-500 hover:text-primary hover:underline transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  } catch (error) {
    console.error('[LocationHubPage] Error:', error);
    notFound();
  }
}
