import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
};

const POSTS_PER_PAGE = 12;

interface Props {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPosts, hasMore } = await getPosts(currentPage, POSTS_PER_PAGE);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog', current: true }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
      
      <BlogPostGrid 
        posts={posts} 
        currentPage={currentPage}
        totalPosts={totalPosts}
        postsPerPage={POSTS_PER_PAGE}
        hasMore={hasMore}
      />
    </main>
  );
}
