'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/blog';
import { BlogPostCard } from '../BlogPostCard';
import { PostCardSkeleton } from './PostCardSkeleton';
import { formatCategoryTitle, getCategoryError } from '@/utils/category-utils';
import { ValidCategory } from '@/utils/category-mapper';

interface CategoryPostsProps {
  category: ValidCategory;
  initialPosts?: Post[];
}

export function CategoryPosts({ category, initialPosts }: CategoryPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPosts) {
      fetchPosts();
    }
  }, [category, initialPosts]);

  async function fetchPosts() {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/posts/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(getCategoryError(err));
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <p className="text-gray-600">
        No posts found in {formatCategoryTitle(category)}.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post}
          showTags={true}
        />
      ))}
    </div>
  );
}
