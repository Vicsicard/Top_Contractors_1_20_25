import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getPostBySlug } from '@/utils/posts';
import type { Post } from '@/types/blog';

interface Props {
  params: {
    trade: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await getPostBySlug(params.slug, params.trade);

  if (!post) {
    return {
      title: 'Post Not Found | Top Contractors Denver',
      robots: 'noindex, nofollow'
    };
  }

  return {
    title: `${post.title} | Top Contractors Denver`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.feature_image,
          width: 1200,
          height: 630,
          alt: post.feature_image_alt
        }
      ]
    }
  };
}

function BlogContent({ html }: { html: string }) {
  if (!html) {
    return <p className="text-gray-600">Content not available</p>;
  }

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function BlogPost({ params }: Props) {
  const { post } = await getPostBySlug(params.slug, params.trade);

  if (!post) {
    notFound();
  }

  const formattedDate = format(new Date(post.published_at), 'MMMM d, yyyy');

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between text-gray-600 mb-8">
          <div className="flex items-center">
            <Link
              href={post.author_url}
              className="text-blue-600 hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.author}
            </Link>
            <span className="mx-2">•</span>
            <time dateTime={post.published_at}>{formattedDate}</time>
          </div>
          <span>{post.reading_time} min read</span>
        </div>

        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <BlogContent html={post.html} />
      </div>

      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <Link
          href={`/blog/page/1?category=${post.trade_category}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to {post.trade_category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Articles
        </Link>
      </footer>
    </article>
  );
}
