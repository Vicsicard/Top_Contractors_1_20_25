import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/posts';
import { BlogPostDisplay } from '@/components/BlogPostDisplay';
import { isValidCategory } from '@/utils/category-mapper';
import { Suspense } from 'react';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    // Use notFound() instead of returning a page with noindex
    notFound();
  }

  return {
    title: `${post.title} | Top Contractors Denver Blog`,
    description: post.excerpt || `Read about ${post.title} on Top Contractors Denver Blog`,
    robots: {
      index: true,
      follow: true
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  console.log('Rendering blog post page:', params);

  if (!isValidCategory(params.category)) {
    console.log('Invalid category:', params.category);
    notFound();
  }

  console.log('Attempting to fetch post with slug:', params.slug);
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    console.log('Post not found:', params.slug);
    notFound();
  }

  console.log('Post data received:', {
    title: post.title,
    category: post.trade_category,
    htmlLength: post.html?.length || 0,
    excerpt: post.excerpt?.substring(0, 100),
    htmlPreview: post.html?.substring(0, 500)
  });

  // Verify the post belongs to the correct category
  const postCategory = post.trade_category?.toLowerCase().replace(' ', '-');
  console.log('Category comparison:', {
    postCategory,
    urlCategory: params.category,
    match: postCategory === params.category
  });

  if (postCategory !== params.category) {
    console.log('Category mismatch:', { postCategory, urlCategory: params.category });
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    }>
      <BlogPostDisplay post={post} />
    </Suspense>
  );
}
