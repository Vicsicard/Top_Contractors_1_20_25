import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Trade Types | Top Contractors Denver',
  description: 'Browse articles by trade type on Top Contractors Denver.',
};

const POSTS_PER_PAGE = 12;

interface Props {
  searchParams: {
    page?: string;
  };
}

/**
 * TradeTypesPage component
 * 
 * This component is responsible for rendering the trade types page.
 * It fetches posts from the API, groups them by trade type, and displays them in a grid.
 * 
 * @param {Props} props - The component props
 * @returns {JSX.Element} The trade types page component
 */
export default async function TradeTypesPage({ searchParams }: Props) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { posts } = await getPosts(currentPage, POSTS_PER_PAGE);

  // Group posts by trade type
  const tradeTypeMap = new Map<string, typeof posts>();
  posts.forEach(post => {
    if (!post.trade_category) return;
    const category = post.trade_category.toLowerCase();
    const existing = tradeTypeMap.get(category) || [];
    tradeTypeMap.set(category, [...existing, post]);
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trade Types', href: '/blog/trades/tradeType', current: true }
  ];

  if (tradeTypeMap.size === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">No Trade Types Found</h1>
          <p className="text-gray-600">No trade types found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Browse by Trade Type</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from(tradeTypeMap.entries()).map(([category, posts]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            <p className="text-gray-600 mb-4">{posts.length} articles</p>
            <a
              href={`/blog/trades/tradeType/${category}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View Articles →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
