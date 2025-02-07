import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostCard } from '@/components/BlogPostCard';
import { Pagination } from '@/components/Pagination';
import { getPostsByTrade } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';

interface Props {
  params: {
    trade: string;
    page: string;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trade, page } = params;
  const pageNum = parseInt(page);
  const tradeData = tradesData[trade];

  if (!tradeData) {
    return {
      title: 'Trade Not Found | Top Contractors Denver',
      description: 'The requested trade could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const title = tradeData.title;
  const description = `Page ${pageNum} of blog posts about ${title.toLowerCase()} and related topics.`;

  return {
    title: `${title} Blog Posts - Page ${pageNum} | Top Contractors Denver`,
    description,
    openGraph: {
      title: `${title} Blog Posts - Page ${pageNum} | Top Contractors Denver`,
      description,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/trades/${trade}/page/${page}`,
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/trades/${trade}/page/${page}`,
    }
  };
}

export default async function TradeBlogPage({ params }: Props) {
  const { trade, page } = params;
  const pageNum = parseInt(page);
  const tradeData = tradesData[trade];

  if (!tradeData || isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  const { posts, totalPages } = await getPostsByTrade(trade, pageNum);

  if (pageNum > totalPages) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: tradeData.title, href: `/trades/${trade}` },
    { label: 'Blog', href: `/blog/trades/${trade}` },
    { label: `Page ${pageNum}`, href: `/blog/trades/${trade}/page/${pageNum}` }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <a href={item.href} className="text-blue-600 hover:text-blue-800">
                {item.label}
              </a>
              {index < breadcrumbItems.length - 1 && <span className="mx-2">→</span>}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-4xl font-bold mb-8">
        {tradeData.title} Blog Posts - Page {pageNum}
      </h1>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            baseUrl={`/blog/trades/${trade}`}
          />
        </>
      ) : (
        <p className="text-gray-600 text-center">
          No posts found for this trade category.
        </p>
      )}
    </div>
  );
}
