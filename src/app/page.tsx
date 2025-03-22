import { Metadata } from 'next';
import { CategoryList } from '@/components/CategoryList';
import { getAllTrades } from '@/utils/database';
import { generateOrganizationSchema } from '@/utils/schema';

export const metadata: Metadata = {
  title: 'Top Contractors Denver | Find Local Contractors for Home Services',
  description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects. Read reviews, compare pros, and get free quotes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Top Contractors Denver | Find Local Contractors for Home Services',
    description: 'Find the best local contractors in Denver for your home improvement, remodeling, and repair projects. Read reviews, compare pros, and get free quotes.',
    url: '/',
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
                webpageSchema
              ]
            })
          }}
        />
        
        <header 
          className="relative h-[600px] w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/denver sky 4.jpg')`,
            backgroundPosition: 'center 30%'
          }}
        >
          <div className="absolute inset-0 hero-overlay">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg text-center max-w-4xl leading-tight">
                Top Denver Contractors
                <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl">Local Pros for Home Improvement, Remodeling, and Repairs</span>
              </h1>
              <h2 className="text-lg md:text-xl lg:text-2xl text-white opacity-90 drop-shadow-md text-center max-w-3xl leading-relaxed">
                Discover trusted Denver contractors for home improvement, remodeling, and repairs. Verified local pros to bring your projects to life.
              </h2>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-12">
          <div className="section-light p-8 -mt-20 relative z-10">
            <CategoryList categories={categories} />
          </div>
          
          <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-primary-dark mb-4">
              Your Trusted Source for Denver Home Services
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
              Whether you&apos;re planning a major renovation or need routine maintenance, our network of verified contractors in Denver has you covered. We carefully vet each professional to ensure they meet our high standards for quality, reliability, and customer service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-white rounded-xl shadow-md">
                <div className="text-accent-warm text-2xl mb-4">✓</div>
                <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                <p className="text-gray-600">Every contractor in our network undergoes thorough vetting and maintains high service standards.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <div className="text-accent-warm text-2xl mb-4">✓</div>
                <h3 className="text-xl font-semibold mb-3">Local Expertise</h3>
                <p className="text-gray-600">Our contractors know Denver&apos;s unique requirements and building codes inside and out.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-md">
                <div className="text-accent-warm text-2xl mb-4">✓</div>
                <h3 className="text-xl font-semibold mb-3">Verified Reviews</h3>
                <p className="text-gray-600">Real feedback from Denver homeowners helps you make informed decisions.</p>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-4 text-center">
              Expert Services Across Denver Metro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Home Improvement Specialists</h3>
                <p className="text-gray-600">From minor repairs to major renovations, our contractors bring years of experience to every project. We specialize in kitchen remodels, bathroom updates, and whole-home renovations.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3">Professional Trade Services</h3>
                <p className="text-gray-600">Access skilled electricians, plumbers, HVAC technicians, and more. All our trade professionals are licensed, insured, and ready to tackle your project.</p>
              </div>
            </div>
          </section>

          <section className="mt-16 mb-12">
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
