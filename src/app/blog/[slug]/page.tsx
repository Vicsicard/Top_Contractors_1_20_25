import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/posts';
import { PostContent } from '@/components/blog/PostContent';

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
      canonical: `/blog/${post.slug}`
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
