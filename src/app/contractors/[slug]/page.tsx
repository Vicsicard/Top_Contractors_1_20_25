import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getContractorBySlug,
  getAllContractors,
  getContractorsByTradeAndSubregion,
} from '@/utils/database';
import { generateContractorSchema, generateContractorBreadcrumbSchema, generateFAQPageSchema } from '@/utils/schema';
import {
  MapPin, Phone, Globe, Star, BadgeCheck, ArrowRight,
  Clock, ShieldCheck, ChevronRight, BookOpen, Award, Wrench, HelpCircle
} from 'lucide-react';
import { getGuidesByTrade } from '@/data/guides';
import {
  generateUniqueDescription,
  generateServiceAreaText,
  generateCustomerSummary,
  getTradeTemplate,
  generateFAQs,
  getVariedAnchor
} from '@/utils/contractor-content';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const contractors = await getAllContractors();
    return contractors.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const contractor = await getContractorBySlug(params.slug);
    if (!contractor) return { title: 'Contractor Not Found' };

    const c = contractor as any;
    const tradeName: string = c.category?.category_name || 'Contractor';
    const locationName: string = c.subregion?.subregion_name || 'Denver';

    return {
      title: `${contractor.contractor_name} | ${tradeName} in ${locationName} | Top Contractors Denver`,
      description: `${contractor.contractor_name} is a verified ${tradeName.toLowerCase()} serving ${locationName}, CO. View ratings, contact info, and request a free quote.`,
      alternates: {
        canonical: `https://topcontractorsdenver.com/contractors/${contractor.slug}`,
      },
      openGraph: {
        title: `${contractor.contractor_name} | ${tradeName} in ${locationName}`,
        description: `${contractor.contractor_name} is a verified ${tradeName.toLowerCase()} serving ${locationName}, CO. View ratings, contact info, and request a free quote.`,
        url: `https://topcontractorsdenver.com/contractors/${contractor.slug}`,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Contractor Not Found' };
  }
}

export default async function ContractorProfilePage({ params }: Props) {
  try {
    const contractor = await getContractorBySlug(params.slug);
    if (!contractor) notFound();

    const c = contractor as any;
    const tradeName: string = c.category?.category_name || 'Contractor';
    const tradeSlug: string = c.category?.slug || '';
    const locationName: string = c.subregion?.subregion_name || 'Denver';
    const locationSlug: string = c.subregion?.slug || '';

    const rating: number = contractor.google_rating || 0;
    const reviewCount: number = contractor.reviews_count || 0;
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    // Nearby contractors in same trade+location (exclude self)
    let nearbyContractors: any[] = [];
    if (tradeSlug && locationSlug) {
      const all = await getContractorsByTradeAndSubregion(tradeSlug, locationSlug);
      nearbyContractors = all.filter((nc) => nc.slug !== contractor.slug).slice(0, 3);
    }

    // Generate enhanced content
    const contentParams = {
      contractorName: contractor.contractor_name,
      tradeName,
      tradeSlug,
      locationName,
      locationSlug,
      rating,
      reviewCount,
    }
    
    const uniqueDescription = generateUniqueDescription(contentParams)
    const serviceAreaText = generateServiceAreaText(contentParams)
    const customerSummary = generateCustomerSummary(contentParams)
    const tradeTemplate = getTradeTemplate(tradeSlug)
    const faqs = generateFAQs(contentParams)
    
    const contractorSchema = generateContractorSchema(contractor, c.category, c.subregion);
    const breadcrumbSchema = generateContractorBreadcrumbSchema(contractor, c.category, c.subregion);
    const faqSchema = faqs.length > 0 ? generateFAQPageSchema(faqs) : null;
    
    const lastUpdated = new Date().toISOString().split('T')[0]

    return (
      <div className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema ? [contractorSchema, breadcrumbSchema, faqSchema] : [contractorSchema, breadcrumbSchema]) }}
        />

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <nav className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/contractors" className="hover:text-primary transition-colors">Contractors</Link>
            {tradeSlug && (
              <>
                <ChevronRight size={12} />
                <Link href={`/services/${tradeSlug}`} className="hover:text-primary transition-colors">{tradeName}</Link>
              </>
            )}
            {tradeSlug && locationSlug && (
              <>
                <ChevronRight size={12} />
                <Link href={`/services/${tradeSlug}/${locationSlug}`} className="hover:text-primary transition-colors">{locationName}</Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium truncate max-w-[160px]">{contractor.contractor_name}</span>
          </div>
        </nav>

        {/* ── Hero Card ──────────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100 py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-green-100">
                  <BadgeCheck size={13} />
                  Verified Contractor
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {contractor.contractor_name}
                </h1>
                <p className="text-base sm:text-lg text-primary font-semibold mb-4">
                  {tradeName} in {locationName}, CO
                </p>

                {rating > 0 && (
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < fullStars
                              ? 'text-yellow-400 fill-yellow-400'
                              : i === fullStars && hasHalf
                              ? 'text-yellow-300 fill-yellow-200'
                              : 'text-gray-300 fill-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800">{rating.toFixed(1)}</span>
                    {reviewCount > 0 && (
                      <span className="text-gray-500 text-sm">({reviewCount} Google reviews)</span>
                    )}
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-gray-600 text-sm">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{contractor.address}</span>
                  </div>
                  {contractor.phone && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone size={16} className="text-gray-400 flex-shrink-0" />
                      <a href={`tel:${contractor.phone}`} className="text-primary font-medium hover:underline">
                        {contractor.phone}
                      </a>
                    </div>
                  )}
                  {contractor.website && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Globe size={16} className="text-gray-400 flex-shrink-0" />
                      <a
                        href={contractor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {contractor.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Card */}
              <div className="sm:w-64 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col gap-3 flex-shrink-0">
                <p className="text-sm font-semibold text-primary-dark text-center leading-snug">
                  Get a Free Quote from<br />{contractor.contractor_name}
                </p>
                <a
                  href={`/get-a-quote?contractor=${encodeURIComponent(contractor.contractor_name)}&trade=${encodeURIComponent(tradeName)}&location=${encodeURIComponent(locationName)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow hover:scale-105 transition-all duration-200 text-sm"
                >
                  Request Free Quote <ArrowRight size={15} />
                </a>
                {contractor.phone && (
                  <a
                    href={`tel:${contractor.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold rounded-xl transition-all duration-200 text-sm"
                  >
                    <Phone size={14} /> Call Now
                  </a>
                )}
                <p className="text-xs text-gray-400 text-center">Free &bull; No obligation</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Unique Description */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About {contractor.contractor_name}
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {uniqueDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>
              </div>
            </section>

            {/* Verification & Credentials */}
            <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                Verification & Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <BadgeCheck size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Licensed & Insured</p>
                    <p className="text-xs text-gray-600 mt-0.5">Meets Colorado requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Background Verified</p>
                    <p className="text-xs text-gray-600 mt-0.5">Screened by our team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Star size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Customer Reviewed</p>
                    <p className="text-xs text-gray-600 mt-0.5">{reviewCount > 0 ? `${reviewCount} Google reviews` : 'Verified ratings'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Specializations */}
            {tradeTemplate?.specializations && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  Specializations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tradeTemplate.specializations.map((spec) => (
                    <div key={spec} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <BadgeCheck size={12} className="text-indigo-600" />
                      </div>
                      {spec}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Types */}
            {tradeTemplate?.projectTypes && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Wrench size={20} className="text-primary" />
                  Project Types
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tradeTemplate.projectTypes.map((project) => (
                    <div key={project} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <BadgeCheck size={12} className="text-primary" />
                      </div>
                      {project}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Typical Project Timeline */}
            {tradeTemplate?.typicalTimeline && (
              <section className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Typical Project Timeline</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{tradeTemplate.typicalTimeline}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Services */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  `${tradeName} Installation`,
                  `${tradeName} Repair`,
                  `${tradeName} Replacement`,
                  `${tradeName} Maintenance`,
                  `${tradeName} Inspection`,
                  `Emergency ${tradeName} Services`,
                ].map((service) => (
                  <div key={service} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck size={12} className="text-primary" />
                    </div>
                    {service}
                  </div>
                ))}
              </div>
            </section>

            {/* Service Area */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Service Area
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {serviceAreaText.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                  <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{contractor.address}</span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contractor.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                >
                  View on Google Maps <ArrowRight size={12} />
                </a>
              </div>
            </section>

            {/* Customer Experience Summary */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Customer Experience
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{customerSummary}</p>
              {rating > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < fullStars
                              ? 'text-yellow-400 fill-yellow-400'
                              : i === fullStars && hasHalf
                              ? 'text-yellow-300 fill-yellow-200'
                              : 'text-gray-300 fill-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{rating.toFixed(1)}</span>
                  </div>
                  {reviewCount > 0 && (
                    <span className="text-gray-500 text-xs">Based on {reviewCount} Google reviews</span>
                  )}
                </div>
              )}
            </section>

            {/* FAQs */}
            {faqs.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <HelpCircle size={20} className="text-primary" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-5">
                  {faqs.map((faq, index) => (
                    <div key={index} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why Choose */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Why Choose {contractor.contractor_name}?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { icon: ShieldCheck, color: 'bg-blue-50 text-blue-600',   title: 'Verified & Licensed', desc: 'Meets all Colorado licensing and insurance requirements.' },
                  { icon: Star,        color: 'bg-yellow-50 text-yellow-600', title: 'Highly Rated',       desc: `${rating > 0 ? rating.toFixed(1) + ' star rating' : 'Rated'} by real customers on Google.` },
                  { icon: Clock,       color: 'bg-green-50 text-green-600',  title: 'Local Expert',        desc: `Serving ${locationName} and the Denver metro area.` },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50">
                    <div className={`p-2.5 rounded-xl mb-3 ${color}`}>
                      <Icon size={20} strokeWidth={1.75} />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <MapPin size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{contractor.address}</span>
                </div>
                {contractor.phone && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${contractor.phone}`} className="text-primary hover:underline font-medium">
                      {contractor.phone}
                    </a>
                  </div>
                )}
                {contractor.website && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe size={15} className="text-gray-400 flex-shrink-0" />
                    <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Browse more in same trade */}
            {tradeSlug && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Browse More {tradeName}</h3>
                <div className="space-y-1">
                  {locationSlug && (
                    <Link
                      href={`/services/${tradeSlug}/${locationSlug}`}
                      className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 transition-colors"
                    >
                      <span>{tradeName} in {locationName}</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </Link>
                  )}
                  <Link
                    href={`/services/${tradeSlug}`}
                    className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 transition-colors"
                  >
                    <span>All {tradeName} in Denver</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                  {locationSlug && (
                    <Link
                      href={`/locations/${locationSlug}`}
                      className="flex items-center justify-between text-sm text-gray-700 hover:text-primary py-2 transition-colors"
                    >
                      <span>All Contractors in {locationName}</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Related guides */}
            {(() => {
              const guides = getGuidesByTrade(tradeSlug || '').slice(0, 3)
              if (!guides.length) return null
              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                    <BookOpen size={15} className="text-primary" /> {tradeName} Guides
                  </h3>
                  <div className="space-y-1">
                    {guides.map((g, index) => (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}/`}
                        className="flex items-start gap-2 text-sm text-gray-700 hover:text-primary py-2 border-b border-gray-50 last:border-0 transition-colors"
                        title={getVariedAnchor(g.title, index)}
                      >
                        <ChevronRight size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{g.title}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/guides/" className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3">
                    All guides <ArrowRight size={11} />
                  </Link>
                </div>
              )
            })()}

            {/* Nearby contractors */}
            {nearbyContractors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3 text-base">
                  Other {tradeName} in {locationName}
                </h3>
                <div className="space-y-2">
                  {nearbyContractors.map((nc) => (
                    <Link
                      key={nc.slug}
                      href={`/contractors/${nc.slug}`}
                      className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0 hover:text-primary transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-primary leading-snug">{nc.contractor_name}</p>
                        {nc.google_rating > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">{nc.google_rating.toFixed(1)}★ · {nc.reviews_count || 0} reviews</p>
                        )}
                      </div>
                      <ChevronRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#0f1f4a' }}>
              <p className="text-white font-bold text-sm mb-1">Ready to get started?</p>
              <p className="text-blue-200 text-xs mb-4">Free quotes, no obligation.</p>
              <a
                href={`/get-a-quote?contractor=${encodeURIComponent(contractor.contractor_name)}&trade=${encodeURIComponent(tradeName)}&location=${encodeURIComponent(locationName)}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-primary-dark font-bold text-sm rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-200"
              >
                Get Free Quote <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </div>

        {/* ── Footer internal link strip ─────────────────────────────── */}
        <div className="border-t border-gray-200 bg-white py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs text-gray-400 text-center mb-4">Find more contractors in Denver</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {[
                { label: 'Roofers',               href: '/services/roofers' },
                { label: 'Plumbers',               href: '/services/plumbers' },
                { label: 'Electricians',           href: '/services/electricians' },
                { label: 'Kitchen Remodelers',     href: '/services/kitchen-remodelers' },
                { label: 'Bathroom Remodelers',    href: '/services/bathroom-remodelers' },
                { label: 'HVAC',                   href: '/services/hvac' },
                { label: 'Painters',               href: '/services/painters' },
                { label: 'Landscapers',            href: '/services/landscapers' },
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
    console.error('[ContractorProfilePage] Error:', error);
    notFound();
  }
}
