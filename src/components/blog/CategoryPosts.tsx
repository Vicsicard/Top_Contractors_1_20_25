'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/blog';
import { BlogPostCard } from '@/components/BlogPostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { getPosts } from '@/utils/posts';

interface CategoryPostsProps {
  category: string;
}

export async function CategoryPosts({ category }: CategoryPostsProps) {
  console.log('Fetching posts for category:', category);
  
  // Try different variations of the category
  const variations = [
    category,
    category.replace('-', ' '),
    category.split('-')[0]
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
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No posts found in this category.</p>
      </div>
    );
  }

  const { posts, totalPosts } = result;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <BlogPostCard 
            key={post.id} 
            post={post}
          />
        ))}
      </div>

      {totalPosts > posts.length && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {posts.length} of {totalPosts} posts
          </p>
        </div>
      )}
    </div>
  );
}
