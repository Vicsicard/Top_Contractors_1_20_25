import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTrades } from '@/utils/database';
import { generateOrganizationSchema } from '@/utils/schema';
import FAQAccordion from '@/components/FAQAccordion';
import { GUIDES } from '@/data/guides';
import {
  ShieldCheck, MapPin, Star, BadgeCheck, Clock, ArrowRight,
  FileText, Home, Bath, Zap, Wind, Paintbrush,
  Hammer, Layers, Blocks, DoorOpen, AppWindow,
  LayoutGrid, Leaf, Wrench, HardHat, SeparatorHorizontal, Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Contractors Denver | Find Local Contractors for Home Services',
  description: 'Find trusted local contractors in Denver for home improvement, remodeling, and repair projects. Compare verified pros and get free quotes.',
  alternates: { canonical: 'https://topcontractorsdenver.com/' },
  openGraph: {
    title: 'Top Contractors Denver | Find Local Contractors for Home Services',
    description: 'Find trusted local contractors in Denver for home improvement, remodeling, and repair projects. Compare verified pros and get free quotes.',
    url: 'https://topcontractorsdenver.com/',
    type: 'website',
  }
};

export const revalidate = 3600;

const SERVICES = [
  { name: 'Bathroom Remodelers',    desc: 'Trusted bathroom remodeling contractors in Denver', slug: 'bathroom-remodelers',    icon: Bath },
  { name: 'Decks',                  desc: 'Trusted deck contractors in Denver',                slug: 'decks',                  icon: Layers },
  { name: 'Electricians',           desc: 'Licensed electricians in Denver',                   slug: 'electricians',           icon: Zap },
  { name: 'Epoxy Garage',           desc: 'Epoxy flooring specialists in Denver',              slug: 'epoxy-garage',           icon: LayoutGrid },
  { name: 'Fencing',                desc: 'Trusted fence contractors in Denver',               slug: 'fencing',                icon: SeparatorHorizontal },
  { name: 'Flooring',               desc: 'Professional flooring contractors in Denver',       slug: 'flooring',               icon: LayoutGrid },
  { name: 'Home Remodelers',        desc: 'Full-service home remodeling contractors',          slug: 'home-remodelers',        icon: Home },
  { name: 'HVAC',                   desc: 'Heating and air conditioning experts',              slug: 'hvac',                   icon: Wind },
  { name: 'Kitchen Remodelers',     desc: 'Kitchen remodeling specialists',                    slug: 'kitchen-remodelers',     icon: Hammer },
  { name: 'Landscapers',            desc: 'Professional landscapers in Denver',                slug: 'landscapers',            icon: Leaf },
  { name: 'Masonry',                desc: 'Stone and masonry specialists',                     slug: 'masonry',                icon: Blocks },
  { name: 'Painters',               desc: 'Interior and exterior painters',                    slug: 'painters',               icon: Paintbrush },
  { name: 'Plumbers',               desc: 'Licensed plumbers in Denver',                       slug: 'plumbers',               icon: Wrench },
  { name: 'Roofers',                desc: 'Professional roofers in Denver',                    slug: 'roofers',                icon: HardHat },
  { name: 'Siding & Gutters',       desc: 'Siding and gutter specialists',                     slug: 'siding-gutters',         icon: AppWindow },
  { name: 'Windows',                desc: 'Window installation experts',                       slug: 'windows',                icon: DoorOpen },
] as const;

export default async function HomePage() {
  try {
    const categories = await getAllTrades();
    console.log(`[HomePage] Fetched ${categories?.length || 0} categories`);

    const organizationSchema = generateOrganizationSchema();
    const websiteSchema = {
      '@type': 'WebSite',
      '@id': 'https://topcontractorsdenver.com/#website',
      url: 'https://topcontractorsdenver.com/',
      name: 'Top Contractors Denver',
      description: 'Find trusted local contractors in Denver for home improvement, remodeling, and repair projects.',
      potentialAction: [{ '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://topcontractorsdenver.com/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }]
    };
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': 'https://topcontractorsdenver.com/#breadcrumb',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://topcontractorsdenver.com/' }]
    };
    const webpageSchema = {
      '@type': 'WebPage',
      '@id': 'https://topcontractorsdenver.com/#webpage',
      url: 'https://topcontractorsdenver.com/',
      inLanguage: 'en-US',
      name: 'Top Contractors Denver',
      isPartOf: { '@id': 'https://topcontractorsdenver.com/#website' },
      breadcrumb: { '@id': 'https://topcontractorsdenver.com/#breadcrumb' },
      description: 'Find trusted local contractors in Denver for home improvement, remodeling, and repair projects.',
      headline: 'Find Trusted Contractors in Denver, CO for Your Next Project',
      keywords: 'Denver contractors, home improvement Denver, remodeling contractors, hire contractors Denver, compare contractors, contractor quotes Denver',
    };
    const faqPageSchema = {
      '@type': 'FAQPage',
      '@id': 'https://topcontractorsdenver.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I hire a contractor in Denver?',
          acceptedAnswer: { '@type': 'Answer', text: 'Browse our directory by service type, review contractor profiles and ratings, then submit a free quote request. We connect you directly with verified local professionals who specialize in your project.' },
        },
        {
          '@type': 'Question',
          name: 'Are the contractors on your platform licensed and insured?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every contractor in our network is required to hold valid state licensing and carry appropriate insurance coverage before being listed. We verify credentials as part of our vetting process.' },
        },
        {
          '@type': 'Question',
          name: 'How much does it cost to get a quote?',
          acceptedAnswer: { '@type': 'Answer', text: 'Getting quotes through our platform is completely free. There is no obligation to hire and no fees for homeowners. Simply submit your project details and receive quotes from qualified local contractors.' },
        },
        {
          '@type': 'Question',
          name: 'How long does a typical home improvement project take in Denver?',
          acceptedAnswer: { '@type': 'Answer', text: 'Project timelines vary by scope. Minor repairs may take a day or two, while full remodels can take several weeks. Your contractor will provide a detailed timeline during the quoting process based on your specific project.' },
        },
        {
          '@type': 'Question',
          name: 'What areas in the Denver metro do your contractors serve?',
          acceptedAnswer: { '@type': 'Answer', text: 'Our contractors serve the entire Denver metro area including Denver, Aurora, Lakewood, Arvada, Westminster, Thornton, Centennial, Highlands Ranch, Littleton, Englewood, and surrounding communities.' },
        },
        {
          '@type': 'Question',
          name: 'What types of home improvement projects can I find contractors for?',
          acceptedAnswer: { '@type': 'Answer', text: 'We cover all major trades including kitchen remodeling, bathroom remodeling, roofing, HVAC, plumbing, electrical, flooring, painting, landscaping, fencing, windows, siding, masonry, and general contracting.' },
        },
        {
          '@type': 'Question',
          name: 'How do I compare contractors before hiring?',
          acceptedAnswer: { '@type': 'Answer', text: 'Each contractor profile includes their service area, specialties, and verified reviews from real Denver homeowners. You can request multiple quotes and compare pricing, timelines, and credentials before making a decision.' },
        },
      ],
    };

    return (
      <div className="min-h-screen bg-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [organizationSchema, websiteSchema, webpageSchema, breadcrumbSchema, faqPageSchema] }) }} />

        {/* ── 1. HERO ─────────────────────────────────────────────────── */}
        <header
          className="relative w-full"
          style={{
            backgroundImage: "url('/top banner image 1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            minHeight: 'clamp(520px, 75vh, 720px)',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,20,60,0.85) 0%, rgba(10,20,60,0.5) 55%, rgba(10,20,60,0.1) 100%)' }} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                Find Trusted Contractors in Denver, CO for Your Next Project
              </h1>
              <h2 className="text-base sm:text-xl font-semibold text-blue-200 mb-4">
                Compare Verified Local Contractors and Get Free Project Quotes
              </h2>
              <p className="hidden sm:block text-sm sm:text-base text-gray-200 mb-8 leading-relaxed">
                Browse vetted local pros, compare services, and confidently hire the right contractor for your home improvement or construction project.
              </p>
              <a
                href="/get-a-quote"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Get Free Project Quotes <ArrowRight size={18} />
              </a>
              <p className="mt-3 text-xs sm:text-sm text-blue-200 opacity-90">
                Free &bull; No obligation &bull; Connect with local pros
              </p>
            </div>
          </div>
        </header>

        {/* ── 2. TRUST BAR ────────────────────────────────────────────── */}
        <div className="w-full bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {[
                { icon: BadgeCheck, label: '500+',    sub: 'Verified Contractors' },
                { icon: Star,       label: '4.8★',    sub: 'Average Rating' },
                { icon: MapPin,     label: 'Serving', sub: 'the Denver Metro Area' },
                { icon: Clock,      label: 'Free',    sub: 'Project Quotes' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="flex items-center justify-center gap-3 px-6 py-5 flex-1">
                  <Icon size={20} className="text-primary flex-shrink-0" strokeWidth={2} />
                  <div>
                    <span className="font-bold text-primary-dark text-sm">{label} </span>
                    <span className="text-gray-500 text-sm">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main>

          {/* ── 3. CATEGORY GRID ────────────────────────────────────────── */}
          <section className="bg-white py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-2 text-center">
                Find Local Contractors by Service
              </h2>
              <p className="text-gray-500 text-center mb-12 text-sm sm:text-base max-w-xl mx-auto">
                Browse our network of verified professionals across all major trades in Denver
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {SERVICES.map(({ name, desc, slug, icon: Icon }) => (
                  <a
                    key={slug}
                    href={`/services/${slug}`}
                    className="group flex flex-col p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="p-3 bg-blue-50 rounded-xl text-primary w-fit mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="font-semibold text-primary-dark group-hover:text-primary text-sm sm:text-base leading-snug mb-1 transition-colors duration-200">
                      {name}
                    </span>
                    <span className="text-xs text-gray-500 leading-relaxed">{desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ── 4. FEATURED GUIDES ──────────────────────────────────────── */}
          {(() => {
            const FEATURED_SLUGS = [
              'cost-to-replace-roof-denver',
              'cost-kitchen-remodel-denver',
              'cost-bathroom-remodel-denver',
              'cost-hvac-replacement-denver',
              'questions-to-ask-before-hiring-contractor-denver',
              'best-home-improvements-roi-denver',
            ];
            const featured = FEATURED_SLUGS.map(s => GUIDES.find(g => g.slug === s)).filter(Boolean) as typeof GUIDES;
            const categoryColors: Record<string, string> = {
              cost:     'bg-green-50 text-green-700',
              hiring:   'bg-blue-50 text-blue-700',
              permit:   'bg-orange-50 text-orange-700',
              timeline: 'bg-purple-50 text-purple-700',
              seasonal: 'bg-yellow-50 text-yellow-700',
            };
            return (
              <section className="bg-gray-50 border-t border-gray-100 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-end justify-between mb-10">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-2">
                        Denver Homeowner Guides
                      </h2>
                      <p className="text-gray-500 text-sm sm:text-base max-w-xl">
                        Local cost data, hiring advice, and permit guides for Denver home improvement projects.
                      </p>
                    </div>
                    <Link
                      href="/guides/"
                      className="hidden sm:inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline flex-shrink-0 ml-4"
                    >
                      View all guides <ArrowRight size={15} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}/`}
                        className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6 flex flex-col flex-1">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${categoryColors[guide.category] ?? 'bg-gray-100 text-gray-600'}`}>
                            {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                          </span>
                          <h3 className="font-bold text-primary-dark text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                            {guide.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                            {guide.metaDescription}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold">
                            Read guide <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 text-center sm:hidden">
                    <Link
                      href="/guides/"
                      className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
                    >
                      View all guides <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ── 5. MID-PAGE CTA ─────────────────────────────────────────── */}
          <section className="bg-blue-50 border-t border-blue-100 py-14 px-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-primary-dark mb-2">
              Ready to connect with trusted local contractors?
            </p>
            <p className="text-gray-500 text-sm mb-6">Free quotes from verified Denver professionals — no obligation.</p>
            <a
              href="/get-a-quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Free Project Quotes <ArrowRight size={18} />
            </a>
          </section>

          {/* ── 5. AUTHORITY SECTION ────────────────────────────────────── */}
          <section className="bg-white border-t border-gray-100 py-20 px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-3">
                Your Trusted Source for Denver Home Services
              </h2>
              <p className="text-gray-500 mb-14 max-w-2xl mx-auto text-sm sm:text-base">
                Every contractor is vetted, licensed, and reviewed by real Denver homeowners to ensure quality workmanship and dependable service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: ShieldCheck, color: 'bg-blue-50 text-blue-600',    title: 'Quality Assurance',      desc: 'Every contractor undergoes a thorough vetting process and maintains high service standards before joining our network.' },
                  { icon: MapPin,      color: 'bg-orange-50 text-orange-500', title: 'Local Denver Expertise', desc: 'Our contractors understand Denver building codes, climate considerations, and local construction requirements.' },
                  { icon: Star,        color: 'bg-green-50 text-green-600',   title: 'Verified Reviews',       desc: 'Real feedback from homeowners helps you compare contractors and choose with confidence.' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="p-8 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-gray-100 text-left">
                    <div className={`inline-flex p-3 rounded-xl mb-5 ${color}`}>
                      <Icon size={26} strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-bold text-primary-dark mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. HOW IT WORKS ─────────────────────────────────────────── */}
          <section className="bg-gray-50 border-t border-gray-100 py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-2 text-center">
                How to Find the Right Contractor in Denver
              </h2>
              <p className="text-gray-500 text-center mb-14 text-sm sm:text-base">
                Get matched with qualified professionals in three simple steps.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { step: '1', icon: FileText, title: 'Tell Us Your Project', desc: 'Describe your project scope, timeline, and budget using our quick request form.' },
                  { step: '2', icon: Users,    title: 'Get Matched',          desc: 'We connect you with verified Denver contractors who specialize in your project type.' },
                  { step: '3', icon: Home,     title: 'Compare and Hire',     desc: 'Review quotes, check ratings, and hire the best contractor for your needs.' },
                ].map(({ step, icon: Icon, title, desc }) => (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon size={28} className="text-primary" strokeWidth={1.75} />
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow">
                        {step}
                      </span>
                    </div>
                    <h3 className="font-bold text-primary-dark text-lg mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 7. FINAL CTA ────────────────────────────────────────────── */}
          <section className="border-t border-blue-900 py-20 px-4 text-center" style={{ backgroundColor: '#0f1f4a' }}>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#ffffff' }}>
                Ready to Start Your Home Improvement Project?
              </h2>
              <p className="text-base sm:text-lg mb-8" style={{ color: '#e2e8f0' }}>
                Get free quotes from top-rated Denver contractors today. No obligation and no pressure.
              </p>
              <a
                href="/get-a-quote"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-dark font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
              >
                Get Free Project Quotes <ArrowRight size={20} />
              </a>
            </div>
          </section>

          {/* ── 8. SEO AUTHORITY BLOCK ──────────────────────────────────── */}
          <section className="bg-gray-50 border-t border-gray-200 py-14 px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed text-center">
                Denver homeowners rely on trusted contractors for remodeling, repairs, and construction projects of all sizes.
                Whether you are planning a kitchen renovation, bathroom remodel, roofing replacement, or new home improvement project,
                finding reliable professionals is essential. Our platform helps you compare experienced contractors, review services,
                and request quotes from trusted local companies serving the entire Denver metro area including Denver, Aurora,
                Lakewood, Arvada, Westminster, Thornton, Centennial, Highlands Ranch, and Littleton.
              </p>
            </div>
          </section>

          {/* ── 9. FAQ ──────────────────────────────────────────────────── */}
          <section className="bg-white border-t border-gray-100 py-20 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark mb-3 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-center mb-12 text-sm sm:text-base">
                Common questions about hiring contractors in Denver
              </p>
              <FAQAccordion />
            </div>
          </section>

        </main>
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
      </div>
    );
  }
}
