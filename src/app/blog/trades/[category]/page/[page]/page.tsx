import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { getStandardCategory } from '@/utils/category-mapper';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { Pagination } from '@/components/Pagination';
import type { Post } from '@/types/blog';

interface Props {
  params: { 
    category: string;
    page: string;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page: pageStr } = params;
  const standardCategory = getStandardCategory(category);
  
  if (!standardCategory) {
    return {
      title: 'Category Not Found | Top Contractors Denver',
      description: 'The requested category could not be found.',
    };
  }

  const page = parseInt(pageStr, 10);
  const title = standardCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: page === 1 
      ? `${title} Blog Posts | Top Contractors Denver`
      : `${title} Blog Posts - Page ${page} | Top Contractors Denver`,
    description: `Expert advice and tips about ${title.toLowerCase()} from Denver's top contractors. Page ${page}.`,
    openGraph: {
      title: page === 1 
        ? `${title} Blog Posts | Top Contractors Denver`
        : `${title} Blog Posts - Page ${page} | Top Contractors Denver`,
      description: `Expert advice and tips about ${title.toLowerCase()} from Denver's top contractors. Page ${page}.`,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/trades/${category}/page/${page}`,
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/trades/${category}/page/${page}`,
    }
  };
}

export default async function CategoryBlogPage({ params }: Props) {
  const { category, page: pageStr } = params;
  const page = parseInt(pageStr, 10);
  
  if (isNaN(page) || page < 1) {
    notFound();
  }

  const standardCategory = getStandardCategory(category);
  if (!standardCategory) {
    notFound();
  }

  const result = await getPostsByCategory(standardCategory, page);
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <CategoryList />
          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Error Loading Posts</h1>
            <p className="text-gray-600">There was an error loading the posts. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const { posts, totalPages } = result;
  
  if (page > totalPages) {
    notFound();
  }

  const title = standardCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <CategoryList />
        <div className="text-center mt-12">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">{title} Articles</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice and tips about {title.toLowerCase()}
          </p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts found in this category.</p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={`/blog/trades/${category}`}
        />
      </div>
    </div>
  );
}
