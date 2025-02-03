import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPosts } from '@/utils/posts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { PostCardSkeleton } from '@/components/blog/PostCardSkeleton';
import { isValidCategory, getStandardCategory } from '@/utils/category-mapper';
import { formatCategoryTitle, getCategoryMetadata } from '@/utils/category-utils';
import { Suspense } from 'react';

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

  const metadata = getCategoryMetadata(params.category);
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
    },
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TradeCategoryPage({ params }: Props) {
  console.log('Rendering category page for:', params.category);
  const standardCategory = getStandardCategory(params.category);
  console.log('Standardized category:', standardCategory);
  
  if (!standardCategory || !isValidCategory(standardCategory)) {
    console.log('Invalid category, showing 404');
    notFound();
  }

  const categoryTitle = formatCategoryTitle(standardCategory);
  console.log('Category title:', categoryTitle);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {categoryTitle} Articles
      </h1>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      }>
        <Posts category={standardCategory} />
      </Suspense>
    </div>
  );
}

// Separate async component for posts
async function Posts({ category }: { category: string }) {
  console.log('Fetching posts for category:', category);
  
  // Get all variations of this category
  const variations = [
    category,
    category.replace('-', ' '),  // e.g., "bathroom-remodeling" -> "bathroom remodeling"
    category.split('-')[0],      // e.g., "bathroom-remodeling" -> "bathroom"
  ];
  console.log('Category variations to check:', variations);
  
  // Try each variation
  let posts = null;
  for (const variation of variations) {
    console.log('Trying category variation:', variation);
    posts = await getPosts(undefined, variation);
    if (posts?.edges.length) {
      console.log('Found posts with variation:', variation);
      break;
    }
  }

  if (!posts?.edges.length) {
    console.log('No posts found for any category variation');
    return (
      <p className="text-gray-600">
        No posts found in {formatCategoryTitle(category)}.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.edges.map(({ node: post }) => (
        <BlogPostCard 
          key={post.id} 
          post={post}
          showTags={true}
        />
      ))}
    </div>
  );
}
