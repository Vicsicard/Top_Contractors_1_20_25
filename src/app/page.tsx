import { Metadata } from 'next';
import { CategoryList } from '@/components/CategoryList';
import { getAllTrades } from '@/utils/database';
import { generateOrganizationSchema } from '@/utils/schema';
import { ShieldCheck, MapPin, Star, BadgeCheck, Clock, PhoneCall, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Top Contractors Denver | Find Local Contractors for Home Services',
  description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects. Read reviews, compare pros, and get free quotes.',
  alternates: {
    canonical: 'https://topcontractorsdenver.com/',
  },
  openGraph: {
    title: 'Top Contractors Denver | Find Local Contractors for Home Services',
    description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects. Read reviews, compare pros, and get free quotes.',
    url: 'https://topcontractorsdenver.com/',
    type: 'website',
  }
};

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  try {
    console.log('[HomePage] Fetching categories...');
    const categories = await getAllTrades();
    console.log(`[HomePage] Successfully fetched ${categories?.length || 0} categories`);
    
    if (!categories || categories.length === 0) {
      console.error('[HomePage] No categories returned from getAllTrades');
    } else {
      console.log('[HomePage] First few categories:', categories.slice(0, 3).map(c => c.category_name));
    }

    // Generate website and organization schemas
    const organizationSchema = generateOrganizationSchema();
    const websiteSchema = {
      '@type': 'WebSite',
      '@id': 'https://topcontractorsdenver.com/#website',
      url: 'https://topcontractorsdenver.com/',
      name: 'Top Contractors Denver',
      description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects.',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://topcontractorsdenver.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      ]
    };
    
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': 'https://topcontractorsdenver.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://topcontractorsdenver.com/'
        }
      ]
    };
    
    const webpageSchema = {
      '@type': 'WebPage',
      '@id': 'https://topcontractorsdenver.com/#webpage',
      url: 'https://topcontractorsdenver.com/',
      inLanguage: 'en-US',
      name: 'Home',
      isPartOf: {
        '@id': 'https://topcontractorsdenver.com/#website'
      },
      breadcrumb: {
        '@id': 'https://topcontractorsdenver.com/#breadcrumb'
      },
      description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects.',
      headline: 'Top Contractors Denver',
      image: 'https://topcontractorsdenver.com/images/denver-sky-4.jpg',
      keywords: 'Denver contractors, home improvement, remodeling, repair',
      mainEntityOfPage: {
        '@id': 'https://topcontractorsdenver.com/#webpage'
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                organizationSchema,
                websiteSchema,
                webpageSchema,
                breadcrumbSchema
              ]
            })
          }}
        />
        
        <header
          className="relative w-full"
          style={{
            backgroundImage: `url('/top banner image 1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            minHeight: 'clamp(480px, 75vh, 720px)',
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0" style={{ background: 'rgba(10,20,50,0.55)' }} />
          {/* Hero content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                Find Trusted Contractors in Denver, CO for Your Next Project
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-200 mb-5 drop-shadow">
                Compare Verified Local Contractors and Get Free Project Quotes
              </h2>
              <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                Browse vetted local pros, compare services, and confidently hire the right contractor for your home improvement or construction project. Our Denver contractor directory helps you find reliable professionals across all trades.
              </p>
              <a
                href="/get-a-quote"
                className="inline-block px-10 py-4 bg-primary hover:bg-blue-700 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-blue-900/40 transform hover:scale-105 transition-all duration-300"
              >
                Get Free Project Quotes
              </a>
              <p className="mt-3 text-xs sm:text-sm text-blue-200 opacity-90">
                Free &bull; No obligation &bull; Connect with local pros
              </p>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-12">
          <div className="section-light p-8 -mt-20 relative z-10">
            <CategoryList categories={categories} />
          </div>
          
          {/* Trust Bar */}
          <section className="mt-10 mb-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BadgeCheck, label: '500+', sub: 'Verified Contractors' },
                { icon: Star, label: '4.8★', sub: 'Average Rating' },
                { icon: MapPin, label: 'Denver', sub: 'Metro Coverage' },
                { icon: Clock, label: 'Free', sub: 'Same-Day Quotes' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Icon size={22} className="text-primary mb-2" strokeWidth={1.75} />
                  <span className="text-xl font-bold text-primary-dark">{label}</span>
                  <span className="text-xs text-gray-500 mt-0.5">{sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mt-14 text-center">
            <h2 className="text-3xl font-bold text-primary-dark mb-3">
              Your Trusted Source for Denver Home Services
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Every contractor is vetted, licensed, and reviewed by real Denver homeowners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShieldCheck,
                  color: 'bg-blue-50 text-blue-600',
                  title: 'Quality Assurance',
                  desc: 'Every contractor undergoes thorough vetting and maintains high service standards before joining our network.',
                },
                {
                  icon: MapPin,
                  color: 'bg-orange-50 text-orange-500',
                  title: 'Local Denver Expertise',
                  desc: "Our contractors know Denver's unique building codes, climate, and requirements inside and out.",
                },
                {
                  icon: Star,
                  color: 'bg-green-50 text-green-600',
                  title: 'Verified Reviews',
                  desc: 'Real feedback from Denver homeowners helps you choose the right contractor with confidence.',
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="p-7 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-50 text-left">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${color}`}>
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-dark mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mt-16 bg-white rounded-2xl shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold text-primary-dark mb-2 text-center">How It Works</h2>
            <p className="text-gray-500 text-center mb-10">Get matched with the right contractor in 3 easy steps</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: PhoneCall, title: 'Tell Us Your Project', desc: 'Fill out a quick form describing your project, timeline, and budget.' },
                { step: '2', icon: BadgeCheck, title: 'Get Matched', desc: "We connect you with verified Denver contractors who specialize in your project type." },
                { step: '3', icon: Star, title: 'Compare & Hire', desc: 'Review quotes, check ratings, and hire the best contractor for your needs.' },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                    {step}
                  </div>
                  <Icon size={22} className="text-primary mb-3" strokeWidth={1.75} />
                  <h3 className="font-semibold text-primary-dark text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="mt-16 mb-12 rounded-2xl bg-primary-dark text-white text-center py-14 px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
              Get free quotes from Denver&apos;s top-rated contractors today. No obligation, no hassle.
            </p>
            <a
              href="/get-a-quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-dark font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 transition-all duration-300"
            >
              Get Free Project Quotes
              <ArrowRight size={20} />
            </a>
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
