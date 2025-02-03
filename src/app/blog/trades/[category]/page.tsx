import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { getPosts } from '@/utils/posts';
import { getStandardCategory } from '@/utils/category-mapper';
import type { Post } from '@/types/blog';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params;
  const standardCategory = getStandardCategory(category);
  
  if (!standardCategory) {
    return {
      title: 'Category Not Found | Top Contractors Denver',
      description: 'The requested category could not be found.',
    };
  }

  const title = standardCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} Blog Posts | Top Contractors Denver`,
    description: `Read our latest articles about ${title.toLowerCase()} and related topics.`,
    openGraph: {
      title: `${title} Blog Posts | Top Contractors Denver`,
      description: `Read our latest articles about ${title.toLowerCase()} and related topics.`,
      type: 'website',
      images: [
        {
          url: 'https://6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io/f1738570015825x940388143865540100/FLUX.1-schnell',
          width: 1200,
          height: 630,
          alt: `${title} Blog Posts`
        }
      ]
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  console.log('Category page requested for:', category);

  // Get the standardized category
  const standardCategory = getStandardCategory(category);
  console.log('Standardized category:', standardCategory);

  if (!standardCategory) {
    console.log('Category not found:', category);
    notFound();
  }

  // Format the category title
  const categoryTitle = standardCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Try different variations of the category to find posts
  const variations = [
    standardCategory,
    standardCategory.replace('-', ' '),
    standardCategory.split('-')[0]
  ];

  let result = null;
  for (const variation of variations) {
    console.log('Trying category variation:', variation);
    result = await getPosts(undefined, variation);
    if (result?.posts.length) {
      console.log('Found posts with variation:', variation);
      break;
    }
  }

  if (!result || !result.posts.length) {
    console.log('No posts found for any category variation');
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryTitle} Blog Posts</h1>
        <CategoryList />
        <p className="text-gray-600 mt-8">No posts found in this category.</p>
      </div>
    );
  }

  const { posts, totalPosts } = result;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryTitle} Blog Posts</h1>
      
      {/* Trade Categories Section */}
      <section className="mb-12">
        <CategoryList />
      </section>

      {/* Posts Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => (
            <BlogPostCard 
              key={post.id} 
              post={post}
            />
          ))}
        </div>
      </section>

      {totalPosts > posts.length && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {posts.length} of {totalPosts} posts in {categoryTitle}
          </p>
        </div>
      )}
    </div>
  );
}
