import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GUIDES, GUIDE_CATEGORIES, getGuideBySlug, getGuidesByCategory, type GuideCategory } from '@/data/guides'
import { ArrowRight, ChevronRight, BadgeCheck, DollarSign, BookOpen, Clock, FileText, Sun } from 'lucide-react'

interface Props {
  params: { slug: string }
}

const CATEGORY_ICONS: Record<GuideCategory, React.ElementType> = {
  cost:     DollarSign,
  hiring:   BookOpen,
  timeline: Clock,
  permit:   FileText,
  seasonal: Sun,
}

const CATEGORY_COLORS: Record<GuideCategory, string> = {
  cost:     'bg-blue-50 text-blue-700 border-blue-100',
  hiring:   'bg-green-50 text-green-700 border-green-100',
  timeline: 'bg-purple-50 text-purple-700 border-purple-100',
  permit:   'bg-orange-50 text-orange-700 border-orange-100',
  seasonal: 'bg-yellow-50 text-yellow-700 border-yellow-100',
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug)
  if (!guide) return { title: 'Guide Not Found' }
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `https://topcontractorsdenver.com/guides/${guide.slug}/` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `https://topcontractorsdenver.com/guides/${guide.slug}/`,
      type: 'article',
    },
  }
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) notFound()

  const relatedGuides = guide.relatedGuides
    .map((slug) => getGuideBySlug(slug))
    .filter(Boolean) as typeof GUIDES

  const CategoryIcon = CATEGORY_ICONS[guide.category]
  const categoryLabel = GUIDE_CATEGORIES[guide.category].label

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    url: `https://topcontractorsdenver.com/guides/${guide.slug}/`,
    publisher: {
      '@type': 'Organization',
      name: 'Top Contractors Denver',
      url: 'https://topcontractorsdenver.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://topcontractorsdenver.com/' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://topcontractorsdenver.com/guides/' },
        { '@type': 'ListItem', position: 3, name: guide.title, item: `https://topcontractorsdenver.com/guides/${guide.slug}/` },
      ],
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }} />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{guide.title}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mb-4 ${CATEGORY_COLORS[guide.category]}`}>
            <CategoryIcon size={12} />
            {categoryLabel}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight max-w-3xl">
            {guide.title}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mb-6">{guide.intro}</p>
          <Link
            href={`/services/${guide.tradeSlug}`}
            className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
          >
            Find {guide.trade} in Denver <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Key Takeaways */}
          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-7">
            <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <BadgeCheck size={18} className="text-primary" /> Key Takeaways
            </h2>
            <ul className="space-y-2.5">
              {guide.keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold leading-none">{i + 1}</span>
                  </div>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Article sections */}
          {guide.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">{section.heading}</h2>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          {/* FAQ */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {guide.faqs.map(({ q, a }) => (
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
            <p className="font-bold text-gray-900 text-sm mb-1">Ready to hire?</p>
            <p className="text-gray-500 text-xs mb-4">Get free quotes from verified {guide.trade.toLowerCase()} in Denver.</p>
            <Link
              href={`/services/${guide.tradeSlug}/`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-all duration-200 text-sm"
            >
              Find {guide.trade} <ArrowRight size={15} />
            </Link>
            {guide.relatedTradeSlug && guide.relatedTrade && (
              <Link
                href={`/services/${guide.relatedTradeSlug}/`}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mt-2 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                Also: {guide.relatedTrade} <ArrowRight size={13} />
              </Link>
            )}
            <a
              href={`/get-a-quote?trade=${encodeURIComponent(guide.trade)}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mt-2 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              Get Free Quote
            </a>
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Related Guides</h3>
              <div className="space-y-2">
                {relatedGuides.map((rg) => {
                  const RIcon = CATEGORY_ICONS[rg.category]
                  return (
                    <Link
                      key={rg.slug}
                      href={`/guides/${rg.slug}`}
                      className="flex items-start gap-2.5 text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <RIcon size={14} className="text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-primary" />
                      <span className="leading-snug">{rg.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Location hub link */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Find Contractors Near You</h3>
            <div className="space-y-1">
              {[
                { label: 'Denver Contractors',      href: '/locations/denver' },
                { label: 'Aurora Contractors',      href: '/locations/aurora' },
                { label: 'Lakewood Contractors',    href: '/locations/lakewood' },
                { label: 'Arvada Contractors',      href: '/locations/arvada' },
                { label: 'Westminster Contractors', href: '/locations/westminster' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-1.5 border-b border-gray-50 last:border-0 transition-colors">
                  <span>{label}</span>
                  <ChevronRight size={13} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Service hub link */}
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#0f1f4a' }}>
            <p className="text-white font-bold text-sm mb-1">Browse {guide.trade}</p>
            <p className="text-blue-200 text-xs mb-4">Compare verified local contractors.</p>
            <Link
              href={`/services/${guide.tradeSlug}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-primary-dark font-bold text-sm rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
            >
              View Contractors <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom link strip */}
      <div className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-400 text-center mb-4">More Denver home improvement guides</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 8).map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="text-xs text-gray-500 hover:text-primary hover:underline transition-colors"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
