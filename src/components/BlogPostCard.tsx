import { Post } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-48">
        {post.feature_image ? (
          <Image 
            src={post.feature_image} 
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized // Skip Next.js image optimization
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
          <Link href={post.trade_category ? `/blog/trades/${post.trade_category}/${post.slug}` : `/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString()}
          </time>
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
      </div>
    </article>
  );
}
