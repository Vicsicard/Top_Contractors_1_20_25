import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { getAllCategories } from '@/utils/categories';
import BlogPostCard from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { Pagination } from '@/components/Pagination';
import type { Post } from '@/types/blog';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

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

  if (isNaN(page) || page < 1) {
    return {
      title: 'Page Not Found | Top Contractors Denver Blog',
      robots: 'noindex, nofollow'
    };
  }

  const title = category
    ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles - Page ${page}`
    : `Latest Articles - Page ${page}`;

  return {
    title: `${title} | Top Contractors Denver Blog`,
    description: 'Read expert advice and tips from top home improvement contractors in Denver.',
    openGraph: {
      title,
      description: 'Read expert advice and tips from top home improvement contractors in Denver.'
    }
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const page = parseInt(params.page, 10);
  const { category } = searchParams;

  if (isNaN(page) || page < 1) {
    notFound();
  }

  try {
    const [{ posts, total }, categories] = await Promise.all([
      getPosts({
        page,
        pageSize: 12,
        category
      }),
      getAllCategories()
    ]);

    if (posts.length === 0 && page > 1) {
      notFound();
    }

    const totalPages = Math.ceil(total / 12);

    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category
              ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles`
              : 'Latest Articles'}
          </h1>
          <p className="text-xl text-gray-600">
            Expert advice and tips from top home improvement contractors in Denver
          </p>
        </header>

        <CategoryList 
          activeCategory={category}
          categories={categories}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post: Post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={category ? `/blog/page?category=${category}` : '/blog/page'}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading blog page:', error);
    notFound();
  }
}
