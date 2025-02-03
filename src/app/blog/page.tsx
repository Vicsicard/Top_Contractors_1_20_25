import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import type { Post } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, contractors, and construction tips.',
  openGraph: {
    title: 'Blog | Top Contractors Denver',
    description: 'Read the latest articles about home improvement, contractors, and construction tips.',
    type: 'website',
    images: [
      {
        url: 'https://6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io/f1738570015825x940388143865540100/FLUX.1-schnell',
        width: 1200,
        height: 630,
        alt: 'Top Contractors Denver Blog'
      }
    ]
  },
};

export const revalidate = 3600; // Revalidate every hour

interface BlogPageProps {
  params: Record<never, never>;
  searchParams: {
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  try {
    const { category } = searchParams;
    const posts = await getPosts(6, category); // Fetch 6 most recent posts
    console.log('Fetched posts:', posts, { category }); // Debug log

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Top Contractors Denver Blog</h1>
        
        {/* Trade Categories Section */}
        <section className="mb-12">
          <CategoryList />
        </section>

        {/* Recent Posts Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
          {!posts?.edges.length ? (
            <p className="text-gray-600">No recent posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.edges.map(({ node: post }: { node: Post }) => (
                <BlogPostCard 
                  key={post.id} 
                  post={post}
                  showTags={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Top Contractors Denver Blog</h1>
        <p className="text-red-600">Error loading blog posts. Please try again later.</p>
      </div>
    );
  }
}
