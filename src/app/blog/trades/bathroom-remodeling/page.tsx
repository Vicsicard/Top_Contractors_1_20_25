import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface Props {
  searchParams: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: 'Bathroom Remodeling Articles | Top Contractors Denver',
  description: 'Read expert articles about bathroom remodeling services and contractors in Denver.',
};

const POSTS_PER_PAGE = 12;
const TRADE = 'bathroom-remodeling';

export default async function BathroomRemodelingPage({ searchParams }: Props) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPosts, hasMore } = await getPosts(currentPage, POSTS_PER_PAGE);

  // Filter posts by category
  const categoryPosts = posts.filter(post => {
    if (!post.trade_category) return false;
    const postCategory = post.trade_category.toLowerCase();
    return postCategory === TRADE ||
           postCategory === TRADE.replace(/-/g, ' ') ||
           postCategory === TRADE.split('-')[0];
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Bathroom Remodeling', href: '/blog/trades/bathroom-remodeling', current: true }
  ];

  if (categoryPosts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">No Posts Found</h1>
          <p className="text-gray-600">No bathroom remodeling articles found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Bathroom Remodeling Articles</h1>
      
      <BlogPostGrid 
        posts={categoryPosts} 
        currentPage={currentPage}
        totalPosts={categoryPosts.length}
        postsPerPage={POSTS_PER_PAGE}
        hasMore={false}
      />
    </main>
  );
}
