import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/blog';
import defaultPostImage from '../../../public/images/default-post.svg';

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  const authorName = post.authors?.[0]?.name || 'Top Contractors Denver';
  const featureImage = post.feature_image || defaultPostImage;

  return (
    <div className="min-h-screen bg-gray-50">
      <article>
        {/* Hero Section */}
        <div className="relative bg-blue-900 text-white">
          {featureImage && (
            <div className="absolute inset-0">
              <Image
                src={featureImage}
                alt={post.feature_image_alt || post.title}
                fill
                className="object-cover opacity-20"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90" />
            </div>
          )}

          <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              {post.trade_category && (
                <div className="inline-block bg-blue-600/90 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6">
                  {post.trade_category}
                </div>
              )}
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-center space-x-4 text-blue-50/90">
                <div className="flex items-center">
                  {post.authors?.[0]?.profile_image ? (
                    <Image
                      src={post.authors[0].profile_image}
                      alt={authorName}
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-700/50 backdrop-blur-sm rounded-full mr-2 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {authorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span>{authorName}</span>
                </div>
                <span>•</span>
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.reading_time && (
                  <>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog?tag=${tag.slug}`}
                  className="px-4 py-1.5 bg-white text-sm text-gray-600 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>

          {/* Author Bio */}
          <footer className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4">
              {post.authors?.[0]?.profile_image ? (
                <Image
                  src={post.authors[0].profile_image}
                  alt={authorName}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-blue-600 font-semibold">
                    {authorName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <div className="font-bold text-xl text-gray-900">Written by {authorName}</div>
                {post.authors?.[0]?.bio && (
                  <p className="text-gray-600 mt-1">{post.authors[0].bio}</p>
                )}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
