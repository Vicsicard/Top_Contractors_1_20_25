import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SubregionList } from '@/components/SubregionList';
import { getAllSubregions, getTradeBySlug } from '@/utils/database';
import { generateLocalBusinessSchema, generateBreadcrumbSchema, generateServiceSchema, generateFAQSchema } from '@/utils/schema';
import Breadcrumb from '@/components/breadcrumb';
import { FAQSection } from '@/components/FAQSection';
import { getFAQsForTrade } from '@/data/faqs';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { BlogPostCard } from '@/components/BlogPostCard';

export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = await getTradeBySlug(params.slug);
  
  if (!trade) {
    throw new Error('Trade not found');
  }

  const tradeName = trade.category_name;

  const title = `${tradeName} in Denver | Top-Rated Local Contractors`;
  const description = `Find trusted ${tradeName} in the Denver area. Compare verified reviews, ratings, and get free quotes from licensed and insured local contractors. Expert ${tradeName.toLowerCase()} services for your project.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Top Contractors Denver',
      images: [
        {
          url: 'https://topcontractorsdenver.com/images/denver-skyline.jpg',
          width: 1200,
          height: 630,
          alt: `${tradeName} services in Denver`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://topcontractorsdenver.com/images/denver-skyline.jpg'],
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/trades/${params.slug}`,
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default async function TradePage({ params }: Props) {
  const trade = await getTradeBySlug(params.slug);
  if (!trade) {
    notFound();
  }

  const tradeName = trade.category_name;
  
  // Create schema objects
  const tradeObject = {
    category_name: tradeName,
    slug: params.slug
  };
  
  const denverLocation = {
    subregion_name: 'Denver',
    slug: 'denver'
  };
  
  const faqs = getFAQsForTrade(tradeName);
  const subregions = await getAllSubregions();
  const { posts } = await getPostsByCategory(params.slug);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: tradeName, href: `/trades/${params.slug}` }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              generateLocalBusinessSchema(tradeObject, denverLocation),
              generateServiceSchema(tradeObject, denverLocation),
              generateFAQSchema(faqs)
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(tradeObject, null))
        }}
      />
      <main className="container mx-auto px-4" role="main">
        <Breadcrumb items={breadcrumbItems} />
        
        <article className="py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4" id="main-heading">{tradeName} Services in Denver</h1>
            <p className="text-lg text-gray-600">
              Find the best {tradeName.toLowerCase()} in Denver. Compare verified reviews, 
              ratings, and get free quotes from top local contractors. Our network of licensed 
              and insured professionals ensures quality work for your project.
            </p>
          </header>

          <nav aria-label="Service areas" className="mb-12">
            <SubregionList 
              subregions={subregions} 
              tradeSlug={trade.slug} 
              tradeName={trade.category_name} 
            />
          </nav>
          
          <section className="mt-12" aria-labelledby="benefits-heading">
            <h2 id="benefits-heading" className="text-2xl font-bold mb-6">
              Professional {tradeName} Services: Our Commitment to Quality
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Verified Customer Reviews</h3>
                <p className="text-gray-600">All reviews are from verified customers who have used our services, ensuring transparency and trust.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">Licensed & Insured Experts</h3>
                <p className="text-gray-600">Our contractors are thoroughly vetted, licensed, insured, and highly experienced in their trade.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">No-Cost Project Quotes</h3>
                <p className="text-gray-600">Receive detailed quotes from multiple qualified contractors at no cost to you.</p>
              </div>
            </div>
          </section>

          {posts.length > 0 && (
            <aside className="mt-16" aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="text-2xl font-bold mb-6">
                Expert {tradeName} Tips & Project Guides
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <a 
                  href={`/blog/trades/${params.slug}`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label={`View all ${tradeName} articles and guides`}
                >
                  View All {tradeName} Articles
                </a>
              </div>
            </aside>
          )}

          <section className="mt-16" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="sr-only">Frequently Asked Questions</h2>
            <FAQSection 
              faqs={faqs} 
              category={tradeName}
            />
          </section>
        </article>
      </main>
    </>
  );
}
