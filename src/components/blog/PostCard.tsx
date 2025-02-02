import Image from 'next/image';
import Link from 'next/link';
import type { HashnodePost } from '@/lib/hashnode/types';

interface PostCardProps {
  post: HashnodePost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.coverImage?.url && (
          <div className="relative w-full h-48">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-600">
            {post.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.brief}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{post.author.name}</span>
            <time className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
