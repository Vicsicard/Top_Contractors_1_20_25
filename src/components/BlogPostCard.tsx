import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Post } from '@/types/blog';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const postUrl = `/blog/${post.slug}`;
  const formattedDate = format(new Date(post.published_at), 'MMMM d, yyyy');
  
  // Default image for posts without a feature image
  const defaultImage = '/images/default-post.svg';
  const imageUrl = post.feature_image || defaultImage;
  const imageAlt = post.feature_image_alt || post.title;

  return (
    <article className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={postUrl} className="block">
        {/* Feature Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
          {post.trade_category && (
            <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full shadow-md">
              {post.trade_category}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            {/* Icon based on trade category */}
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.trade_category && (
                <div className="text-sm text-gray-600">
                  {post.trade_category}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.excerpt || `Preview coming soon for "${post.title}"`}
          </div>

          <div className="flex items-center text-sm text-gray-500 justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              {post.authors && post.authors[0] && (
                <>
                  {post.authors[0].profile_image ? (
                    <Image
                      src={post.authors[0].profile_image}
                      alt={post.authors[0].name}
                      width={24}
                      height={24}
                      className="rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-50 rounded-full mr-2 flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-semibold">
                        {post.authors[0].name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="font-medium mr-2">{post.authors[0].name}</span>
                </>
              )}
              <span className="text-gray-400">•</span>
              <time dateTime={post.published_at} className="ml-2">
                {formattedDate}
              </time>
            </div>
            
            {post.reading_time && (
              <span className="text-gray-500">{post.reading_time} min read</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
