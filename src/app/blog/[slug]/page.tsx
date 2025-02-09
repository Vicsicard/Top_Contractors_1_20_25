import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/posts';
import { PostContent } from '@/components/blog/PostContent';
import { Post } from '@/types/blog';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow'
    };
  }

  return {
    title: `${post.title} | Top Contractors Denver Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || undefined,
      authors: ['Top Contractors Denver'],
      images: [
        {
          url: post.feature_image || '/images/default-post.svg',
          alt: post.feature_image_alt || post.title,
          width: 1200,
          height: 630
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: [post.feature_image || '/images/default-post.svg']
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/${post.slug}`
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
