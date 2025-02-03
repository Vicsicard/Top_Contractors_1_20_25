import Image from 'next/image';
import type { Post } from '@/types/blog';
import defaultPostImage from '../../../public/images/default-post.svg';

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  const authorName = post.authors?.[0]?.name || 'Top Contractors Denver';
  const featureImage = post.feature_image || defaultPostImage;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {post.title}
        </h1>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-medium text-gray-900">
              {authorName}
            </div>
            <time className="text-sm text-gray-500">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
        {featureImage && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={featureImage}
              alt={post.feature_image_alt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
      </header>
      
      {post.html && (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      )}

      <footer className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">Written by {authorName}</div>
            {post.authors?.[0]?.bio && (
              <p className="text-gray-600 mt-1">{post.authors[0].bio}</p>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
