import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface Props {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = decodeURIComponent(params.category).replace(/-/g, ' ');
  return {
    title: `${category} Articles | Top Contractors Denver`,
    description: `Read expert articles about ${category} services and contractors in Denver.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    }
  };
}

const POSTS_PER_PAGE = 12;

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = decodeURIComponent(params.category);
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { posts } = await getPosts(currentPage, POSTS_PER_PAGE);

  // Filter posts by category (case-insensitive)
  const categoryPosts = posts.filter(post => {
    if (!post.trade_category) return false;
    const postCategory = post.trade_category.toLowerCase();
    return postCategory === category.toLowerCase() ||
           postCategory === category.replace(/-/g, ' ').toLowerCase() ||
           postCategory === category.split('-')[0].toLowerCase();
  });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.replace(/-/g, ' '), href: `/blog/trades/${category}`, current: true }
  ];

  if (categoryPosts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">No Posts Found</h1>
          <p className="text-gray-600">No posts found in category &ldquo;{category.replace(/-/g, ' ')}&rdquo;.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">{category.replace(/-/g, ' ')} Articles</h1>
      
      <BlogPostGrid 
        posts={categoryPosts} 
        currentPage={currentPage}
        totalPosts={categoryPosts.length}
        postsPerPage={POSTS_PER_PAGE}
      />
    </main>
  );
}
