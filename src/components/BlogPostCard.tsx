'use client';

import { Post } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/date';

interface BlogPostCardProps {
  post: Post;
  showExcerpt?: boolean;
  showAuthor?: boolean;
}

export function BlogPostCard({ post, showExcerpt = true, showAuthor = true }: BlogPostCardProps) {
  // Add error handling for missing post data
  if (!post) {
    console.error('[ERROR] BlogPostCard received null or undefined post');
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
        <div className="text-center text-gray-600">Error: Post data unavailable</div>
      </article>
    );
  }

  // Ensure post has required properties
  const safePost = {
    ...post,
    id: post.id || 'unknown-id',
    title: post.title || 'Untitled Post',
    slug: post.slug || 'unknown-slug',
    excerpt: post.excerpt || '',
    feature_image: post.feature_image || '',
    feature_image_alt: post.feature_image_alt || post.title || 'Blog Image',
    authors: post.authors || 'Top Contractors Denver',
    published_at: post.published_at || post.created_at || new Date().toISOString(),
    tags: post.tags || ''
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${safePost.slug}`} className="block">
        {safePost.feature_image && (
          <div className="relative aspect-video">
            <Image
              src={safePost.feature_image}
              alt={safePost.feature_image_alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7lMuwAAAABJRU5ErkJggg=="
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{safePost.title}</h2>
          
          {showExcerpt && safePost.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{safePost.excerpt}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              {formatDate(safePost.published_at)}
            </div>
            
            {showAuthor && (
              <div>
                By {Array.isArray(safePost.authors) 
                  ? safePost.authors.join(', ') 
                  : safePost.authors}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
