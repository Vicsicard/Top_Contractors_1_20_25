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
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={postUrl} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </Link>

      <div className="p-6">
        <header>
          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags
                .filter(tag => tag && tag.id && tag.name)
                .slice(0, 3)
                .map(tag => (
                  <span
                    key={`${tag.id}_${tag.name}`}
                    className="inline-block bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
          )}

          <Link href={postUrl} className="block group">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
          </Link>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <time dateTime={post.published_at}>{formattedDate}</time>
            {post.reading_time && (
              <>
                <span className="mx-2">•</span>
                <span>{post.reading_time} min read</span>
              </>
            )}
          </div>
        </header>

        <div className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || `Preview coming soon for "${post.title}"`}
        </div>

        {post.authors && post.authors[0] && (
          <footer className="flex items-center">
            {post.authors[0].profile_image ? (
              <Image
                src={post.authors[0].profile_image}
                alt={post.authors[0].name}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-100 rounded-full mr-3 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {post.authors[0].name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-700">{post.authors[0].name}</span>
          </footer>
        )}
      </div>
    </article>
  );
}
