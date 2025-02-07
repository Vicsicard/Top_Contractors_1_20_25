import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { getStandardCategory } from '@/utils/category-mapper';
import type { Post } from '@/types/blog';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params;
  const standardCategory = getStandardCategory(category);
  
  if (!standardCategory) {
    return {
      title: 'Category Not Found | Top Contractors Denver',
      description: 'The requested category could not be found.',
    };
  }

  const title = standardCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} Blog Posts | Top Contractors Denver`,
    description: `Read our latest articles about ${title.toLowerCase()} and related topics.`,
    openGraph: {
      title: `${title} Blog Posts | Top Contractors Denver`,
      description: `Read our latest articles about ${title.toLowerCase()} and related topics.`,
      type: 'website',
      url: `https://topcontractorsdenver.com/blog/trades/${category}`,
      images: [
        {
          url: 'https://6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io/f1738570015825x940388143865540100/FLUX.1-schnell',
          width: 1200,
          height: 630,
          alt: `${title} Blog Posts`
        }
      ]
    },
    alternates: {
      canonical: `https://topcontractorsdenver.com/blog/trades/${category}`,
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const standardCategory = getStandardCategory(category);

  if (!standardCategory) {
    redirect('/blog');
  }

  redirect(`/blog/trades/${category}/page/1`);
}
