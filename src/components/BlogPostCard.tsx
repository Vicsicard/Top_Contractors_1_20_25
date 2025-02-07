'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Post } from '@/types/blog';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = format(new Date(post.published_at), 'MMMM d, yyyy');

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/blog/trades/${post.trade_category}/${post.slug}`}>
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
            {post.title}
          </h2>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.published_at}>{formattedDate}</time>
            </div>
            <span>{post.reading_time} min read</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
