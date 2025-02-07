import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { getTradeBySlug } from '@/utils/database';
import { BlogPostCard } from '@/components/BlogPostCard';
import { Pagination } from '@/components/Pagination';
import Breadcrumb from '@/components/breadcrumb';

interface Props {
  params: { 
    category: string;
    page: string;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = await getTradeBySlug(params.category);
  if (!trade) {
    throw new Error('Trade not found');
  }

  const page = parseInt(params.page, 10);
  const tradeName = trade.category_name;

  const title = page === 1 
    ? `${tradeName} Blog Posts & Guides | Top Contractors Denver`
    : `${tradeName} Blog Posts & Guides - Page ${page} | Top Contractors Denver`;

  const description = `Expert tips, guides, and articles about ${tradeName.toLowerCase()} in Denver. Professional advice and insights from experienced local contractors.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/trades/${params.category}/page/${page}`,
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/trades/${params.category}/page/${page}`,
    }
  };
}

export default async function TradeBlogPage({ params }: Props) {
  const page = parseInt(params.page, 10);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const trade = await getTradeBySlug(params.category);
  if (!trade) {
    notFound();
  }

  const { posts, totalPages } = await getPostsByCategory(params.category, page);
  
  if (page > totalPages) {
    notFound();
  }

  const tradeName = trade.category_name;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: tradeName, href: `/trades/${params.category}` },
    { label: 'Blog', href: `/blog/trades/${params.category}` },
    { label: `Page ${page}`, href: `/blog/trades/${params.category}/page/${page}` }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{tradeName} Tips & Guides</h1>
        <p className="text-lg text-gray-600">
          Expert advice and insights about {tradeName.toLowerCase()} in Denver
        </p>
      </header>

      {posts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/blog/trades/${params.category}`}
          />
        </>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No blog posts found for this category.
        </p>
      )}
    </main>
  );
}
