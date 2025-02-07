'use client';

import { notFound } from 'next/navigation';
import { getPosts } from '@/utils/posts';
import BlogPostCard from '@/components/BlogPostCard';
import type { Post } from '@/types/blog';

interface CategoryPostsProps {
  category: string;
}

export async function CategoryPosts({ category }: CategoryPostsProps) {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  
  const result = await getPosts({
    page: 1,
    pageSize: 12,
    category: normalizedCategory
  });

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load posts.</p>
      </div>
    );
  }

  const { posts } = result;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <BlogPostCard 
            key={post.id} 
            post={{
              ...post,
              html: post.html || `<p>Content coming soon for "${post.title}"</p>`,
              excerpt: post.excerpt?.replace('undefined...', '') || `Preview coming soon for "${post.title}"`,
              authors: post.authors?.length ? post.authors : [{
                id: 'default',
                name: 'Top Contractors Denver',
                slug: 'top-contractors-denver',
                profile_image: null,
                bio: null,
                url: null
              }]
            }}
          />
        ))}
      </div>
      
      {posts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Found {posts.length} posts in this category
          </p>
        </div>
      )}
    </div>
  );
}
