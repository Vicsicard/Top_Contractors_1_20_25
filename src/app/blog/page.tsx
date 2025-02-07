import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getPosts } from '@/utils/posts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { CategoryList } from '@/components/blog/CategoryList';
import type { Post } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, contractors, and construction tips.',
};

export const revalidate = 3600; // Revalidate every hour

interface BlogPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = searchParams;
  redirect(`/blog/page/1${category ? `?category=${category}` : ''}`);
}
