import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BlogPostCard from '@/components/BlogPostCard';
import { getPostBySlug } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/date';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';
import { Author } from '@/types/blog';
import { processHtml } from '@/utils/html-processor';
import { BlogContentErrorBoundary } from '@/components/BlogContentErrorBoundary';
import { Suspense } from 'react';

interface Props {
  params: {
    trade: string;
    slug: string;
  };
}

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return url.startsWith('/');
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, params.trade);
  const tradeData = tradesData[params.trade];

  if (!post || !tradeData) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  return {
    title: `${post.title} | ${tradeData.title} Blog`,
    description: post.excerpt || `Read about ${tradeData.title.toLowerCase()} on Top Contractors Denver Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || undefined,
      authors: post.authors?.map((author: Author) => author.name) || undefined,
      images: post.feature_image ? [post.feature_image] : undefined,
    },
    alternates: {
      canonical: `/blog/trades/${params.trade}/${params.slug}`
    }
  };
}

function BlogContent({ html }: { html: string }) {
  return (
    <BlogContentErrorBoundary>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processHtml(html) }}
      />
    </BlogContentErrorBoundary>
  );
}

function BlogImages({ post }: { post: any }) {
  if (!post.feature_image || !isValidImageUrl(post.feature_image)) {
    return null;
  }

  return (
    <div className="relative w-full h-[400px] mb-8">
      <Image
        src={post.feature_image}
        alt={post.title}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority
      />
    </div>
  );
}

export default async function TradeBlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug, params.trade);
  const tradeData = tradesData[params.trade];

  if (!post || !tradeData) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.feature_image,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: post.authors?.map((author: Author) => ({
      '@type': 'Person',
      name: author.name,
    })) || [],
    publisher: {
      '@type': 'Organization',
      name: 'Top Contractors Denver',
      logo: {
        '@type': 'ImageObject',
        url: 'https://topcontractorsdenver.com/logo.png'
      }
    }
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <JsonLd data={jsonLd} />
      
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
          </li>
          <li>→</li>
          <li>
            <Link href={`/trades/${params.trade}`} className="text-blue-600 hover:text-blue-800">
              {tradeData.title}
            </Link>
          </li>
          <li>→</li>
          <li>
            <Link href={`/blog/trades/${params.trade}`} className="text-blue-600 hover:text-blue-800">
              Blog
            </Link>
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center text-gray-600">
          {post.authors?.map((author: Author, index: number) => (
            <span key={author.id}>
              {author.name}
              {index < (post.authors?.length || 0) - 1 ? ', ' : ''}
            </span>
          ))}
          <span className="mx-2">•</span>
          <time dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
        </div>
      </header>

      <BlogImages post={post} />

      <Suspense fallback={<div>Loading content...</div>}>
        <BlogContent html={post.html || ''} />
      </Suspense>
    </article>
  );
}
