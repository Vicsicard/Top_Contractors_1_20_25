import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hashnode } from '@/lib/hashnode';
import { PostContent } from '@/components/blog/PostContent';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await hashnode.getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  return {
    title: `${post.title} | Top Contractors Denver Blog`,
    description: post.brief,
    openGraph: {
      title: post.title,
      description: post.brief,
      type: 'article',
      publishedTime: post.datePublished,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: `/blog/${post.slug}`
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const post = await hashnode.getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
