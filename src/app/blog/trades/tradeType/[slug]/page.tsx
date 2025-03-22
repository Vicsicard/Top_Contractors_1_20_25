import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tradeType = decodeURIComponent(params.slug).replace(/-/g, ' ');
  return {
    title: `${tradeType} Articles | Top Contractors Denver`,
    description: `Read expert articles about ${tradeType} services and contractors in Denver.`,
  };
}

const POSTS_PER_PAGE = 12;

export default async function TradeTypePage({ params, searchParams }: Props) {
  const tradeType = decodeURIComponent(params.slug);
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { posts } = await getPosts(currentPage, POSTS_PER_PAGE);

  // Filter posts by trade type
  const tradePosts = posts.filter(post => {
    if (!post.trade_category) return false;
    const postCategory = post.trade_category.toLowerCase();
    return postCategory === tradeType.toLowerCase() ||
           postCategory === tradeType.replace(/-/g, ' ').toLowerCase() ||
           postCategory === tradeType.split('-')[0].toLowerCase();
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: tradeType.replace(/-/g, ' '), href: `/blog/trades/tradeType/${params.slug}`, current: true }
  ];

  if (tradePosts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">No Posts Found</h1>
          <p className="text-gray-600">No posts found in category &ldquo;{tradeType.replace(/-/g, ' ')}&rdquo;.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">{tradeType.replace(/-/g, ' ')} Articles</h1>
      
      <BlogPostGrid 
        posts={tradePosts} 
        currentPage={currentPage}
        totalPosts={tradePosts.length}
        postsPerPage={POSTS_PER_PAGE}
      />
    </main>
  );
}
