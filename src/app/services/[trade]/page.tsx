import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTradeBySlug, getAllSubregions, getAllTrades, getContractorsByTradeAndSubregion } from '@/utils/database'
import { generateBreadcrumbSchema, generateServiceSchema } from '@/utils/schema'
import { MapPin, ArrowRight, ChevronRight, BadgeCheck, Clock, DollarSign, Star, BookOpen } from 'lucide-react'
import { getGuidesByTrade } from '@/data/guides'

interface Props {
  params: { trade: string }
}

const DENVER_LOCATION = { subregion_name: 'Denver', slug: 'denver' }

type TradeContent = {
  intro: string
  body: string
  costRange: string
  timeline: string
  whatToExpect: string[]
  howToChoose: string[]
  commonMistakes: string[]
  faqs: { q: string; a: string }[]
}

const TRADE_CONTENT: Record<string, TradeContent> = {
  'roofers': {
    intro: 'Denver roofing contractors handle everything from minor repairs to full roof replacements. With Colorado\'s hail seasons, intense UV exposure, and heavy snow loads, choosing a qualified local roofer is critical.',
    body: 'A quality roof replacement in Denver involves removing old material, inspecting the decking, installing new underlayment, and applying the new shingles. Denver\'s climate demands materials rated for impact resistance and thermal cycling. Many homeowners opt for Class 4 impact-resistant shingles to qualify for insurance discounts. After major hail events, a licensed roofer can document damage for your insurance claim and manage the entire replacement process.',
    costRange: '$8,000 – $20,000+ depending on roof size, pitch, and materials',
    timeline: '1–3 days for most residential replacements',
    whatToExpect: ['Roof inspection and damage assessment', 'Material selection and written quote', 'Permit pulled if required', 'Old material removal and disposal', 'Decking inspection and repair', 'New roof installation', 'Cleanup and final walkthrough'],
    howToChoose: ['Verify Colorado roofing license and insurance', 'Check for manufacturer certifications (GAF, Owens Corning)', 'Ask about warranty on both materials and labor', 'Get at least 3 written quotes', 'Confirm they handle permit pulling'],
    commonMistakes: ['Hiring storm chasers after hail events', 'Choosing price over quality materials', 'Not verifying insurance coverage', 'Skipping the permit process'],
    faqs: [
      { q: 'How often should I replace my roof in Denver?', a: 'Most asphalt shingle roofs last 20–30 years in Denver. Hail damage can shorten this significantly. Annual inspections are recommended after major storms.' },
      { q: 'Does homeowners insurance cover roof replacement in Denver?', a: 'Many Denver homeowners have hail damage covered by insurance. A licensed roofer can help document damage for your claim.' },
      { q: 'What roofing materials work best in Colorado?', a: 'Class 4 impact-resistant shingles are popular in Denver due to hail risk. Metal roofing is also a durable long-term option for Colorado homes.' },
    ]
  },
  'plumbers': {
    intro: 'Licensed plumbers in Denver handle everything from leaky faucets and drain clogs to full pipe replacements and water heater installations. Denver\'s hard water and freeze-thaw cycles create unique plumbing challenges.',
    body: 'Denver\'s water is notoriously hard, leading to mineral buildup in pipes, water heaters, and fixtures. Local plumbers are experienced with water softener installations, tankless water heater upgrades, and winterization services. Whether you\'re dealing with a burst pipe, slow drain, or planning a bathroom remodel, a licensed Denver plumber ensures code-compliant work that passes inspection.',
    costRange: '$150 – $500 for repairs; $1,000 – $5,000+ for major installations',
    timeline: 'Same-day for emergencies; 1–3 days for larger projects',
    whatToExpect: ['Diagnosis and written estimate', 'Permit pulled for major work', 'Professional installation or repair', 'Pressure testing and inspection', 'Cleanup and final walkthrough'],
    howToChoose: ['Verify Colorado plumbing license', 'Confirm liability insurance and bonding', 'Ask about emergency availability', 'Check Google reviews and ratings', 'Get itemized written quotes'],
    commonMistakes: ['Ignoring slow drains until they become emergencies', 'Hiring unlicensed plumbers to save money', 'Not asking about warranty on parts and labor'],
    faqs: [
      { q: 'Do plumbers in Denver charge for estimates?', a: 'Many Denver plumbers offer free estimates for standard work. Emergency calls may include a service fee.' },
      { q: 'What causes low water pressure in Denver homes?', a: 'Common causes include mineral buildup from hard water, partially closed valves, or aging pipes. A licensed plumber can diagnose and fix the issue.' },
      { q: 'How do I prevent frozen pipes in Denver?', a: 'Insulate pipes in unheated spaces, keep cabinet doors open during cold snaps, and let faucets drip slightly. A plumber can also install pipe insulation.' },
    ]
  },
  'electricians': {
    intro: 'Licensed electricians in Denver handle residential and commercial electrical work including panel upgrades, EV charger installations, lighting, and safety inspections. All electrical work in Colorado requires permits.',
    body: 'Denver\'s older housing stock often requires panel upgrades to support modern electrical loads. With the rise of electric vehicles, EV charger installations have become one of the most requested services. Denver electricians are also experienced with smart home wiring, whole-home generators, and solar integration. All permitted work includes a city inspection for your protection.',
    costRange: '$200 – $800 for standard repairs; $2,000 – $8,000 for panel upgrades',
    timeline: 'Half-day to 2 days depending on scope',
    whatToExpect: ['Electrical assessment and quote', 'Permit application', 'Licensed installation', 'City inspection', 'Final sign-off and documentation'],
    howToChoose: ['Verify Colorado electrical license (C1 or C2)', 'Confirm they pull permits for all work', 'Check BBB rating and Google reviews', 'Ask about warranty on labor', 'Confirm they carry liability insurance'],
    commonMistakes: ['DIY electrical work without permits', 'Hiring unlicensed contractors', 'Overloading circuits instead of upgrading the panel'],
    faqs: [
      { q: 'Do I need a permit for electrical work in Denver?', a: 'Yes. Most electrical work in Denver requires a permit and inspection by the city. Licensed electricians handle this process for you.' },
      { q: 'How much does an EV charger installation cost in Denver?', a: 'Level 2 EV charger installation typically costs $500–$1,500 in Denver depending on panel capacity and wiring distance.' },
      { q: 'How do I know if my electrical panel needs upgrading?', a: 'Signs include frequently tripping breakers, flickering lights, or a panel under 200 amps. A licensed electrician can assess your panel\'s capacity.' },
    ]
  },
  'hvac': {
    intro: 'Denver HVAC contractors install, repair, and maintain heating and cooling systems. With temperature swings from -20°F winters to 100°F summers, a reliable HVAC system is essential for Denver homeowners.',
    body: 'Denver\'s climate demands HVAC systems that handle extreme cold and summer heat efficiently. Local contractors are experienced with high-altitude furnace calibration, whole-home humidifiers to combat dry Colorado air, and energy-efficient heat pump installations. Regular maintenance extends system life and keeps energy bills manageable year-round.',
    costRange: '$150 – $500 for repairs; $5,000 – $15,000 for new system installation',
    timeline: '1 day for most installations; same-day for emergency repairs',
    whatToExpect: ['System assessment and written quote', 'Equipment selection', 'Professional installation or repair', 'System testing and calibration', 'Maintenance plan discussion'],
    howToChoose: ['Verify NATE certification', 'Confirm Colorado HVAC license', 'Ask about manufacturer partnerships (Carrier, Trane, Lennox)', 'Check for energy efficiency rebate knowledge', 'Get multiple quotes for major installations'],
    commonMistakes: ['Skipping annual maintenance', 'Choosing undersized equipment', 'Ignoring air quality issues alongside HVAC work'],
    faqs: [
      { q: 'How often should I service my HVAC in Denver?', a: 'Annual service is recommended — furnace in fall, AC in spring. Denver\'s dry air also makes humidifier maintenance important.' },
      { q: 'Are there rebates for new HVAC systems in Denver?', a: 'Yes. Xcel Energy offers rebates for qualifying high-efficiency systems. Your HVAC contractor can help identify eligible equipment.' },
      { q: 'What size HVAC system do I need for my Denver home?', a: 'Sizing depends on square footage, insulation, and ceiling height. A licensed contractor performs a Manual J load calculation to determine the right size.' },
    ]
  },
  'kitchen-remodelers': {
    intro: 'Kitchen remodeling contractors in Denver transform outdated kitchens into modern, functional spaces. From cabinet refacing to full gut renovations, Denver kitchen remodelers handle projects of all sizes.',
    body: 'A kitchen remodel is one of the highest-ROI home improvements in the Denver market. Local contractors understand Denver\'s building codes, permit requirements, and the design preferences of Colorado homeowners. Projects range from cosmetic updates like new countertops and cabinet painting to full structural renovations with custom cabinetry, new layouts, and appliance upgrades.',
    costRange: '$15,000 – $75,000+ depending on scope and finishes',
    timeline: '4–12 weeks for a full remodel',
    whatToExpect: ['Design consultation and 3D rendering', 'Material selection', 'Permit application', 'Demolition and rough-in work', 'Cabinet and countertop installation', 'Appliance installation', 'Final finishes and punch list'],
    howToChoose: ['Review portfolio of completed Denver kitchens', 'Verify general contractor license', 'Ask about subcontractor management', 'Get a detailed written contract with timeline', 'Check references from past clients'],
    commonMistakes: ['Underestimating the budget by 20–30%', 'Not planning for a temporary kitchen setup', 'Choosing trendy finishes over timeless ones', 'Skipping the permit process'],
    faqs: [
      { q: 'How long does a kitchen remodel take in Denver?', a: 'A full kitchen remodel typically takes 6–12 weeks from demo to completion. Custom cabinetry lead times can add 4–8 weeks.' },
      { q: 'Do I need a permit for a kitchen remodel in Denver?', a: 'Yes, if the work involves electrical, plumbing, or structural changes. Your contractor should handle permit applications.' },
      { q: 'What is the ROI on a kitchen remodel in Denver?', a: 'Mid-range kitchen remodels in Denver typically return 60–80% of cost at resale. High-end renovations in desirable neighborhoods can return more.' },
    ]
  },
  'bathroom-remodelers': {
    intro: 'Bathroom remodeling contractors in Denver handle everything from simple fixture upgrades to full master bath renovations. A well-executed bathroom remodel adds significant value to Denver homes.',
    body: 'Denver bathroom remodelers are experienced with the full range of projects — hall bath refreshes, master suite expansions, accessible bathroom conversions, and luxury spa-style renovations. Local contractors manage all trades including plumbing, electrical, tile, and carpentry under one contract, ensuring code-compliant work throughout.',
    costRange: '$8,000 – $40,000+ depending on size and finishes',
    timeline: '2–6 weeks for most bathroom remodels',
    whatToExpect: ['Design consultation and layout planning', 'Material and fixture selection', 'Permit application', 'Demolition', 'Plumbing and electrical rough-in', 'Tile and flooring installation', 'Fixture installation and final finishes'],
    howToChoose: ['Review bathroom portfolio and references', 'Verify license and insurance', 'Confirm they manage all subcontractors', 'Get a detailed scope of work in writing', 'Ask about waterproofing methods'],
    commonMistakes: ['Choosing cheap tile that shows wear quickly', 'Not planning for adequate ventilation', 'Underestimating plumbing relocation costs'],
    faqs: [
      { q: 'How much does a bathroom remodel cost in Denver?', a: 'A mid-range bathroom remodel in Denver typically costs $12,000–$25,000. Master bath renovations with premium finishes can exceed $40,000.' },
      { q: 'How long does a bathroom remodel take?', a: 'Most bathroom remodels take 2–4 weeks. Larger projects or those requiring custom tile work may take 5–6 weeks.' },
      { q: 'Do I need a permit for a bathroom remodel in Denver?', a: 'Yes, if the work involves plumbing or electrical changes. Your contractor should pull all required permits.' },
    ]
  },
}

function getContent(slug: string, tradeName: string): TradeContent {
  return TRADE_CONTENT[slug] ?? {
    intro: `Professional ${tradeName.toLowerCase()} serving the Denver metro area. Our verified contractors bring expertise, licensing, and local knowledge to every project.`,
    body: `Finding the right ${tradeName.toLowerCase()} in Denver means working with professionals who understand Colorado building codes, local permit requirements, and the specific challenges of the Denver climate. Our network of verified contractors has been vetted for licensing, insurance, and customer satisfaction.`,
    costRange: 'Varies by project scope — request a free quote for accurate pricing',
    timeline: 'Varies by project — your contractor will provide a detailed timeline',
    whatToExpect: ['Initial consultation and written estimate', 'Permit application if required', 'Professional installation or service', 'Quality inspection and walkthrough', 'Cleanup and project completion'],
    howToChoose: ['Verify Colorado contractor license', 'Confirm liability insurance and bonding', 'Check Google reviews and ratings', 'Get at least 3 written quotes', 'Ask about warranty on labor and materials'],
    commonMistakes: ['Choosing the lowest bid without checking credentials', 'Not getting a written contract', 'Skipping the permit process for required work'],
    faqs: [
      { q: `How do I find a reliable ${tradeName.toLowerCase()} in Denver?`, a: `Browse our verified directory, compare ratings, and request free quotes. All listed contractors are vetted for licensing and insurance.` },
      { q: `What should I ask a ${tradeName.toLowerCase()} before hiring?`, a: `Ask about their license number, insurance coverage, warranty terms, timeline, and whether they pull permits. Get everything in writing.` },
      { q: `How much does a ${tradeName.toLowerCase()} cost in Denver?`, a: `Costs vary by project scope. Request free quotes from multiple verified contractors to compare pricing for your specific project.` },
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const trade = await getTradeBySlug(params.trade)
    if (!trade) notFound()
    return {
      title: `${trade.category_name} in Denver, CO | Top Contractors Denver`,
      description: `Find verified ${trade.category_name.toLowerCase()} in Denver, CO. Compare local contractors, read reviews, and get free quotes. Serving the entire Denver metro area.`,
      alternates: { canonical: `https://topcontractorsdenver.com/services/${params.trade}/` },
      openGraph: {
        type: 'website',
        url: `https://topcontractorsdenver.com/services/${params.trade}/`,
        title: `${trade.category_name} in Denver, CO | Top Contractors Denver`,
        description: `Find verified ${trade.category_name.toLowerCase()} in Denver, CO. Compare local contractors, read reviews, and get free quotes.`,
      }
    }
  } catch {
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const trades = await getAllTrades()
    return trades.map((trade) => ({ trade: trade.slug }))
  } catch {
    return []
  }
}

export default async function TradePage({ params }: Props) {
  try {
    const [trade, subregions] = await Promise.all([
      getTradeBySlug(params.trade),
      getAllSubregions(),
    ])
    if (!trade) notFound()

    // Fetch top contractors in Denver for this trade
    const denverContractors = await getContractorsByTradeAndSubregion(trade.slug, 'denver')
    const featuredContractors = denverContractors.slice(0, 4)

    const relatedGuides = getGuidesByTrade(trade.slug).slice(0, 4)

    const content = getContent(trade.slug, trade.category_name)
    const breadcrumbSchema = generateBreadcrumbSchema(trade, null)
    const serviceSchema = generateServiceSchema(trade, DENVER_LOCATION)
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, serviceSchema, faqSchema]) }}
        />

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">{trade.category_name}</span>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {trade.category_name} in Denver, CO
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-3xl">{content.intro}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full border border-blue-100">
                <BadgeCheck size={15} /> Verified Contractors
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
                <Star size={15} /> Free Quotes
              </div>
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full border border-orange-100">
                <MapPin size={15} /> Denver Metro Area
              </div>
            </div>
            <a
              href={`/get-a-quote?trade=${encodeURIComponent(trade.category_name)}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Free {trade.category_name} Quotes <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
                About {trade.category_name} in Denver
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{content.body}</p>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Cost &amp; Timeline</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-xl">
                  <DollarSign size={22} className="text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Typical Cost Range</p>
                    <p className="text-gray-600 text-sm">{content.costRange}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-5 bg-green-50 rounded-xl">
                  <Clock size={22} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Typical Timeline</p>
                    <p className="text-gray-600 text-sm">{content.timeline}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
                What to Expect When Hiring {trade.category_name}
              </h2>
              <ol className="space-y-3">
                {content.whatToExpect.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
                How to Choose the Right {trade.category_name} in Denver
              </h2>
              <div className="space-y-3">
                {content.howToChoose.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BadgeCheck size={12} className="text-primary" />
                    </div>
                    {tip}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">Common Mistakes to Avoid</h2>
              <div className="space-y-3">
                {content.commonMistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 font-bold text-xs leading-none">✕</span>
                    </div>
                    {mistake}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {content.faqs.map(({ q, a }) => (
                  <div key={q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">{q}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* CTA */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="font-bold text-gray-900 text-sm mb-1">Get Free Quotes Today</p>
              <p className="text-gray-500 text-xs mb-4">No obligation. Compare verified contractors.</p>
              <a
                href={`/get-a-quote?trade=${encodeURIComponent(trade.category_name)}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-all duration-200 text-sm"
              >
                Request Free Quote <ArrowRight size={15} />
              </a>
            </div>

            {/* Featured contractors */}
            {featuredContractors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-base">Top {trade.category_name} in Denver</h3>
                <div className="space-y-2">
                  {featuredContractors.map((c: any) => (
                    <Link
                      key={c.slug}
                      href={`/contractors/${c.slug}`}
                      className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 group-hover:text-primary text-xs leading-snug truncate">{c.contractor_name}</p>
                        {c.google_rating > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">{c.google_rating.toFixed(1)}★ · {c.reviews_count || 0} reviews</p>
                        )}
                      </div>
                      <ChevronRight size={13} className="text-gray-300 flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/services/${params.trade}/denver`}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3"
                >
                  View all Denver contractors <ArrowRight size={11} />
                </Link>
              </div>
            )}

            {/* Browse by location */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-base">
                {trade.category_name} by Location
              </h3>
              <div className="space-y-1">
                {subregions.map((subregion) => (
                  <Link
                    key={subregion.id}
                    href={`/services/${params.trade}/${subregion.slug}`}
                    className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <span>{subregion.subregion_name}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Related guides */}
            {relatedGuides.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                  <BookOpen size={15} className="text-primary" /> Related Guides
                </h3>
                <div className="space-y-2">
                  {relatedGuides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="flex items-start gap-2 text-xs text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <ArrowRight size={11} className="flex-shrink-0 mt-0.5 text-gray-400" />
                      <span className="leading-snug">{g.title}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3"
                >
                  All Denver guides <ArrowRight size={11} />
                </Link>
              </div>
            )}

            {/* Sidebar CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#0f1f4a' }}>
              <p className="text-white font-bold text-sm mb-1">Ready to get started?</p>
              <p className="text-blue-200 text-xs mb-4">Free quotes, no obligation.</p>
              <a
                href={`/get-a-quote?trade=${encodeURIComponent(trade.category_name)}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-primary-dark font-bold text-sm rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
              >
                Get Free Quote <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </div>

        {/* Final CTA */}
        <section className="border-t border-blue-900 py-16 px-4 text-center" style={{ backgroundColor: '#0f1f4a' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Find {trade.category_name} in Denver Today
            </h2>
            <p className="text-blue-200 text-sm sm:text-base mb-8">
              Free quotes from verified local professionals. No obligation, no pressure.
            </p>
            <a
              href={`/get-a-quote?trade=${encodeURIComponent(trade.category_name)}`}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-dark font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
            >
              Get Free Quotes <ArrowRight size={20} />
            </a>
          </div>
        </section>

      </div>
    )
  } catch (error) {
    console.error('[TradePage] Error:', error)
    notFound()
  }
}
