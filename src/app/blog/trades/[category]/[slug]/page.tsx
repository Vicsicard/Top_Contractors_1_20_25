import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hashnode, HashnodePost } from '@/lib/hashnode';
import { PostContent } from '@/components/blog/PostContent';
import { isValidCategory, getCategoryTag } from '@/lib/hashnode/utils';
import type { TradeCategory } from '@/lib/hashnode/utils';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Validate category first
  if (!isValidCategory(params.category)) {
    return {
      title: 'Category Not Found | Top Contractors Denver Blog',
      description: 'The requested blog category could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const post = await hashnode.getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  // Get the correct tag for this category
  const category = params.category as TradeCategory;
  const categoryTag = getCategoryTag(category);

  // Verify the post belongs to the correct category
  const hasMatchingTag = post.tags.some((tag: HashnodePost['tags'][0]) => 
    tag.slug.toLowerCase() === categoryTag.toLowerCase()
  );

  if (!hasMatchingTag) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found in this category.',
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
      publishedTime: post.publishedAt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: `/blog/trades/${params.category}/${post.slug}`
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TradeBlogPost({ params }: Props) {
  // Validate category first
  if (!isValidCategory(params.category)) {
    notFound();
  }

  const post = await hashnode.getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Get the correct tag for this category
  const category = params.category as TradeCategory;
  const categoryTag = getCategoryTag(category);

  // Verify the post belongs to the correct category
  const hasMatchingTag = post.tags.some((tag: HashnodePost['tags'][0]) => 
    tag.slug.toLowerCase() === categoryTag.toLowerCase()
  );

  if (!hasMatchingTag) {
    notFound();
  }

  return <PostContent post={post} />;
}
