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
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={postUrl} className="block">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />
          {post.trade_category && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
              {post.trade_category}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <header>
          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags
                .filter(tag => tag && tag.id && tag.name)
                .slice(0, 2)
                .map(tag => (
                  <span
                    key={`${tag.id}_${tag.name}`}
                    className="inline-block bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full border border-gray-100"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
          )}

          <Link href={postUrl} className="block group">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2 transition-colors">
              {post.title}
            </h2>
          </Link>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <time dateTime={post.published_at} className="font-medium">
              {formattedDate}
            </time>
            {post.reading_time && (
              <>
                <span className="mx-2 text-gray-300">•</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
        </header>

        <div className="text-gray-600 text-sm mb-4 line-clamp-2">
          {post.excerpt || `Preview coming soon for "${post.title}"`}
        </div>

        <footer className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center">
            {post.authors && post.authors[0] && (
              <>
                {post.authors[0].profile_image ? (
                  <Image
                    src={post.authors[0].profile_image}
                    alt={post.authors[0].name}
                    width={32}
                    height={32}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-50 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {post.authors[0].name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{post.authors[0].name}</span>
              </>
            )}
          </div>
          <Link 
            href={postUrl}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Read more →
          </Link>
        </footer>
      </div>
    </article>
  );
}
