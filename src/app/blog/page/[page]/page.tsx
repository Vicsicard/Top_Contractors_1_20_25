import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import BlogPostCard from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { Pagination } from '@/components/Pagination';
import type { Post } from '@/types/blog';

interface Props {
  params: { 
    page: string;
  };
  searchParams: {
    category?: string;
  };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const page = parseInt(params.page, 10);
  const { category } = searchParams;

  const title = page === 1 
    ? category
      ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles | Top Contractors Denver`
      : 'Expert Home Improvement Articles | Top Contractors Denver'
    : category
      ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles - Page ${page} | Top Contractors Denver`
      : `Expert Home Improvement Articles - Page ${page} | Top Contractors Denver`;

  const description = category
    ? `Expert advice and tips about ${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').toLowerCase()} from Denver's top contractors. Page ${page}.`
    : `Professional home improvement advice and tips from Denver's top contractors. Find expert guides and articles about construction, remodeling, and more. Page ${page}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/page/${page}${category ? `?category=${category}` : ''}`,
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/page/${page}${category ? `?category=${category}` : ''}`,
    }
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const page = parseInt(params.page, 10);
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const { category } = searchParams;
  const result = await getPosts(page, 12, category);

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

  const { posts, totalPages } = result;

  // If page number is greater than total pages, show 404
  if (page > totalPages) {
    notFound();
  }

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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={`/blog${category ? `?category=${category}` : ''}`}
        />
      </div>
    </div>
  );
}
