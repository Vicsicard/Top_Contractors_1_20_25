import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import type { Post } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, contractors, and construction tips.',
};

export const revalidate = 3600; // Revalidate every hour

interface BlogPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  try {
    const { category } = searchParams;
    const result = await getPosts(undefined, category);

    if (!result) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <CategoryList />
            <div className="text-center mt-12">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Top Contractors Denver Blog</h1>
              <p className="text-gray-600">Error loading posts. Please try again later.</p>
            </div>
          </div>
        </div>
      );
    }

    const { posts } = result;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-blue-900 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90" />
          </div>
          <div className="relative container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {category 
                  ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles`
                  : 'Expert Home Improvement Articles'
                }
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                {category
                  ? `Expert advice and tips about ${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toLowerCase()}`
                  : 'Get professional advice and tips from Denver\'s top contractors'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <CategoryList />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: Post) => (
              <BlogPostCard key={post.id} post={{
                ...post,
                html: post.html || `<p>Content coming soon for &quot;${post.title}&quot;</p>`,
                excerpt: post.excerpt?.replace('undefined...', '') || `Preview coming soon for &quot;${post.title}&quot;`,
              }} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts found{category ? ' in this category' : ''}.</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <CategoryList />
          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Top Contractors Denver Blog</h1>
            <p className="text-gray-600">Error loading posts. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}
