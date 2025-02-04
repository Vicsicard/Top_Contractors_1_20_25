import { Metadata } from 'next';
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
    page?: string;
  };
}

const POSTS_PER_PAGE = 12;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  try {
    const { category, page = '1' } = searchParams;
    const currentPage = parseInt(page, 10);
    const offset = (currentPage - 1) * POSTS_PER_PAGE;
    
    const result = await getPosts(POSTS_PER_PAGE, category, offset);

    if (!result) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <CategoryList />
            <div className="text-center mt-12">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Top Contractors Denver Blog</h1>
              <p className="text-gray-600">Error loading posts. Please try again later.</p>
            </div>
          </div>
        </div>
      );
    }

    const { posts, totalPosts } = result;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-blue-900 text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90" />
          </div>
          <div className="relative container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Top Contractors Denver Blog
              </h1>
              <p className="text-xl text-blue-50/90 max-w-2xl mx-auto">
                Expert tips and insights for your home improvement projects in Denver
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Categories */}
          <div className="mb-12">
            <CategoryList />
          </div>
          
          {/* Blog Posts */}
          <div className="mt-8">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-xl text-gray-600">
                  No posts found {category ? `in category "${category}"` : ''}.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post: Post) => (
                    <BlogPostCard 
                      key={post.id} 
                      post={{
                        ...post,
                        html: post.html || `<p>Content coming soon for "${post.title}"</p>`,
                        excerpt: post.excerpt?.replace('undefined...', '') || `Preview coming soon for "${post.title}"`,
                        authors: post.authors?.length ? post.authors : [{
                          id: 'default',
                          name: 'Top Contractors Denver',
                          slug: 'top-contractors-denver',
                          profile_image: null,
                          bio: null,
                          url: null
                        }]
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <a
                        key={pageNum}
                        href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-8 text-center text-gray-600">
                  Showing {offset + 1}-{Math.min(offset + posts.length, totalPosts)} of {totalPosts} posts
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <CategoryList />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center mt-12">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Error</h1>
            <p className="text-gray-600">
              Something went wrong. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
