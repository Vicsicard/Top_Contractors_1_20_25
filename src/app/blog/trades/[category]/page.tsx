import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hashnode, HashnodePost } from '@/lib/hashnode';
import { PostCard } from '@/components/blog/PostCard';
import { isValidCategory, categoryToTitle, getCategoryTag } from '@/lib/hashnode/utils';
import type { TradeCategory } from '@/lib/hashnode/utils';

interface Props {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isValidCategory(params.category)) {
    return {
      title: 'Category Not Found | Top Contractors Denver Blog',
      description: 'The requested blog category could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const categoryTitle = categoryToTitle(params.category);

  return {
    title: `${categoryTitle} Blog Posts | Top Contractors Denver`,
    description: `Read the latest articles about ${categoryTitle.toLowerCase()} services, tips, and advice.`,
    openGraph: {
      title: `${categoryTitle} Blog Posts | Top Contractors Denver`,
      description: `Read the latest articles about ${categoryTitle.toLowerCase()} services, tips, and advice.`,
      type: 'website',
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TradeCategoryPage({ params }: Props) {
  if (!isValidCategory(params.category)) {
    notFound();
  }

  const category = params.category as TradeCategory;
  const tag = getCategoryTag(category);
  const posts = await hashnode.getPostsByTag(tag);

  if (!posts?.edges.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {categoryToTitle(category)}
        </h1>
        <p className="text-gray-600">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {categoryToTitle(category)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.edges.map(({ node: post }: { node: HashnodePost }) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
