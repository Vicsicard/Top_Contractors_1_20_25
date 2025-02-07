import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostCard from '@/components/BlogPostCard';
import CategoryList from '@/components/CategoryList';
import { getPostsByTrade } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';

interface TradePageProps {
  params: {
    trade: string;
  };
}

export async function generateMetadata({ params }: TradePageProps): Promise<Metadata> {
  const { trade } = params;
  const tradeData = tradesData[trade];
  
  if (!tradeData) {
    return {
      title: 'Trade Not Found | Top Contractors Denver',
      description: 'The requested trade could not be found.',
    };
  }

  return {
    title: `${tradeData.title} Blog Posts | Top Contractors Denver`,
    description: `Read our latest articles about ${tradeData.title.toLowerCase()} and related topics.`,
    openGraph: {
      title: `${tradeData.title} Blog Posts | Top Contractors Denver`,
      description: `Read our latest articles about ${tradeData.title.toLowerCase()} and related topics.`,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/trades/${trade}`,
      images: [
        {
          url: tradeData.icon || 'https://topcontractorsdenver.com/default-trade-image.jpg',
          width: 1200,
          height: 630,
          alt: `${tradeData.title} Blog Posts`
        }
      ]
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/trades/${trade}`,
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TradePage({ params }: TradePageProps) {
  const { trade } = params;
  const tradeData = tradesData[trade];

  if (!tradeData) {
    notFound();
  }

  const { posts } = await getPostsByTrade(trade, 1); // Get first page of posts

  // Transform TradeData into Category format
  const categories = Object.entries(tradesData).map(([slug, data]) => ({
    id: slug,
    category_name: data.title,
    slug,
    description: data.shortDescription,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{tradeData.title} Blog Posts</h1>
      <CategoryList categories={categories} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-600 text-center mt-8">
          No posts found for this trade category.
        </p>
      )}
    </div>
  );
}
