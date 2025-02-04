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
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      notFound(); // This will trigger the not-found page instead of returning noindex
    }

    const canonicalUrl = `https://topcontractorsdenver.com/blog/${post.slug}`;

    return {
      title: `${post.title} | Top Contractors Denver Blog`,
      description: post.excerpt || undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt || undefined,
        type: 'article',
        publishedTime: post.published_at,
        url: canonicalUrl,
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
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Top Contractors Denver',
      description: 'Read our latest blog post about home improvement and contractors.',
      alternates: {
        canonical: `https://topcontractorsdenver.com/blog/${params.slug}`
      }
    };
  }
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
