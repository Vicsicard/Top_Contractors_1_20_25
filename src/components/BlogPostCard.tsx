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
        </div>

        <div className="p-6">
          {/* Trade Category */}
          {post.trade_category && (
            <Link 
              href={`/blog?category=${post.trade_category.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-block mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {post.trade_category}
            </Link>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <div className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.excerpt || `Preview coming soon for "${post.title}"`}
          </div>

          {/* Author and Date */}
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
