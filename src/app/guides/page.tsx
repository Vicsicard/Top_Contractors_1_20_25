import { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES, GUIDE_CATEGORIES, type GuideCategory } from '@/data/guides'
import { ArrowRight, DollarSign, BookOpen, Clock, FileText, Sun, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Denver Home Improvement Guides | Top Contractors Denver',
  description: 'Expert guides for Denver homeowners — cost guides, hiring tips, permit requirements, timelines, and seasonal advice for every major home improvement project.',
  alternates: { canonical: 'https://topcontractorsdenver.com/guides/' },
  openGraph: {
    title: 'Denver Home Improvement Guides | Top Contractors Denver',
    description: 'Expert guides for Denver homeowners — cost guides, hiring tips, permit requirements, timelines, and seasonal advice.',
    url: 'https://topcontractorsdenver.com/guides/',
    type: 'website',
  },
}

const CATEGORY_ICONS: Record<GuideCategory, React.ElementType> = {
  cost:     DollarSign,
  hiring:   BookOpen,
  timeline: Clock,
  permit:   FileText,
  seasonal: Sun,
}

const CATEGORY_COLORS: Record<GuideCategory, string> = {
  cost:     'bg-blue-50 text-blue-600 border-blue-100',
  hiring:   'bg-green-50 text-green-600 border-green-100',
  timeline: 'bg-purple-50 text-purple-600 border-purple-100',
  permit:   'bg-orange-50 text-orange-600 border-orange-100',
  seasonal: 'bg-yellow-50 text-yellow-600 border-yellow-100',
}

const CATEGORY_BADGE_COLORS: Record<GuideCategory, string> = {
  cost:     'bg-blue-50 text-blue-700 border-blue-100',
  hiring:   'bg-green-50 text-green-700 border-green-100',
  timeline: 'bg-purple-50 text-purple-700 border-purple-100',
  permit:   'bg-orange-50 text-orange-700 border-orange-100',
  seasonal: 'bg-yellow-50 text-yellow-700 border-yellow-100',
}

export default function GuidesIndexPage() {
  const categories = Object.entries(GUIDE_CATEGORIES) as [GuideCategory, { label: string; description: string }][]

  const guideSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Denver Home Improvement Guides',
    description: 'Expert guides for Denver homeowners covering costs, hiring tips, permits, timelines, and seasonal advice.',
    url: 'https://topcontractorsdenver.com/guides/',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://topcontractorsdenver.com/' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://topcontractorsdenver.com/guides/' },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }} />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Guides</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            Denver Home Improvement Guides
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mb-8">
            Expert guides for Denver homeowners — real cost data, hiring tips, permit requirements, project timelines, and seasonal advice for every major trade.
          </p>
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(([key, { label }]) => {
              const Icon = CATEGORY_ICONS[key]
              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${CATEGORY_COLORS[key]} transition-opacity hover:opacity-80`}
                >
                  <Icon size={14} />
                  {label}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guide sections by category */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {categories.map(([category, { label, description }]) => {
          const Icon = CATEGORY_ICONS[category]
          const categoryGuides = GUIDES.filter((g) => g.category === category)
          if (categoryGuides.length === 0) return null

          return (
            <section key={category} id={category}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-xl border ${CATEGORY_COLORS[category]}`}>
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{label}</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8 ml-14">{description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_BADGE_COLORS[category]}`}>
                        {label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary text-sm sm:text-base leading-snug mb-2 transition-colors duration-200">
                      {guide.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">
                      {guide.metaDescription}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold mt-auto">
                      Read Guide <ArrowRight size={12} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-blue-900 py-16 px-4 text-center" style={{ backgroundColor: '#0f1f4a' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to Start Your Project?
          </h2>
          <p className="text-blue-200 text-sm sm:text-base mb-8">
            Get free quotes from verified Denver contractors. No obligation.
          </p>
          <a
            href="/get-a-quote"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-dark font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
          >
            Get Free Quotes <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </div>
  )
}
