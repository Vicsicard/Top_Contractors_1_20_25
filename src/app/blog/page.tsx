import { Metadata } from 'next';
import { hashnode, HashnodePost } from '@/lib/hashnode';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryList } from '@/components/blog/CategoryList';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, contractors, and construction tips.',
  openGraph: {
    title: 'Blog | Top Contractors Denver',
    description: 'Read the latest articles about home improvement, contractors, and construction tips.',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await hashnode.getPosts(6); // Reduced to show fewer posts on main page

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Top Contractors Denver Blog</h1>
      
      {/* Trade Categories Section */}
      <section className="mb-12">
        <CategoryList />
      </section>

      {/* Recent Posts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        {!posts?.edges.length ? (
          <p className="text-gray-600">No recent posts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.edges.map(({ node: post }: { node: HashnodePost }) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
