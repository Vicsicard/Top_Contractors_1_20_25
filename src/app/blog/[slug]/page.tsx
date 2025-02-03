import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/posts';
import { PostContent } from '@/components/blog/PostContent';
import { Post } from '@/types';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const typedPost = post as Post;

  return {
    title: `${typedPost.title} | Top Contractors Denver Blog`,
    description: typedPost.excerpt || undefined,
    openGraph: {
      title: typedPost.title,
      description: typedPost.excerpt || undefined,
      type: 'article',
      publishedTime: typedPost.published_at,
      images: [
        {
          url: typedPost.cover_image || '/images/default-post.svg', // Fallback to default image
          alt: typedPost.cover_image_alt || typedPost.title,
          width: 1200,
          height: 630
        }
      ],
    },
    alternates: {
      canonical: `/blog/${typedPost.slug}`
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const typedPost = post as Post;

  return <PostContent post={typedPost} />;
}
