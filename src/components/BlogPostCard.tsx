import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types/blog';
import defaultPostImage from '@/public/images/default-post.svg';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const postUrl = `/blog/${post.slug}`;
  const authorName = post.authors?.[0]?.name || 'Top Contractors Denver';
  const featureImage = post.feature_image || defaultPostImage;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={postUrl} aria-label={`Read article: ${post.title}`}>
        <div className="relative aspect-[16/9]">
          <Image
            src={featureImage}
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-6">
        <Link href={postUrl} className="block mb-4">
          <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <div className="text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          )}
        </Link>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-900 font-medium">{authorName}</p>
            <time className="text-gray-500">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {post.reading_time && (
            <span className="text-gray-500">
              {post.reading_time} min read
            </span>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
