import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.feature_image && (
        <div className="relative aspect-video">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {typeof post.authors === 'string' ? post.authors : (post.authors?.[0] || 'Top Contractors Denver')}
          </span>
          <time className="text-sm text-gray-500">
            {new Date(post.published_at).toLocaleDateString()}
          </time>
        </div>
      </div>
    </article>
  );
}
