import { Post } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const postUrl = post.trade_category 
    ? `/blog/trades/${post.trade_category}/${post.slug}` 
    : `/blog/${post.slug}`;

  return (
    <article 
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      itemScope 
      itemType="https://schema.org/BlogPosting"
    >
      <Link 
        href={postUrl}
        className="relative w-full h-48 block focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Read article: ${post.title}`}
      >
        {post.feature_image ? (
          <>
            <Image 
              src={post.feature_image} 
              alt={post.feature_image_alt || `Featured image for article: ${post.title}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              itemProp="image"
            />
            <meta itemProp="thumbnailUrl" content={post.feature_image} />
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center" aria-hidden="true">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </Link>

      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-xl font-bold mb-2 hover:text-blue-600" itemProp="headline">
          <Link 
            href={postUrl}
            className="hover:text-blue-600 focus:outline-none focus:text-blue-700"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p 
            className="text-gray-600 mb-4 flex-grow"
            itemProp="description"
          >
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <time 
            dateTime={post.published_at}
            itemProp="datePublished"
            className="flex items-center gap-1"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            {new Date(post.published_at).toLocaleDateString()}
          </time>
          {post.reading_time && (
            <span 
              className="flex items-center gap-1"
              aria-label={`${post.reading_time} minute read`}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {post.reading_time} min read
            </span>
          )}
        </div>

        {/* Hidden metadata for SEO */}
        <meta itemProp="author" content="Top Contractors Denver" />
        <meta itemProp="publisher" content="Top Contractors Denver" />
        {post.trade_category && (
          <meta itemProp="articleSection" content={post.trade_category} />
        )}
      </div>
    </article>
  );
}
