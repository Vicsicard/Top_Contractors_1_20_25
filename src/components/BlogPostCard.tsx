import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {post.feature_image && (
        <div className="aspect-video w-full overflow-hidden">
          <Image 
            src={post.feature_image} 
            alt={post.title}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
          {post.reading_time && <span>{post.reading_time} min read</span>}
        </div>
      </div>
    </article>
  );
}
