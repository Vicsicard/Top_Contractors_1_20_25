import Link from 'next/link';
import { BlogPostCard } from '@/components/BlogPostCard';
import type { Post } from '@/types/blog';

interface BlogPostGridProps {
  posts: Post[];
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
  hasMore: boolean;
}

export function BlogPostGrid({ posts, currentPage, totalPosts, postsPerPage, hasMore }: BlogPostGridProps) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const offset = (currentPage - 1) * postsPerPage;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/blog?page=${pageNum}`}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-600">
        Showing {offset + 1}-{Math.min(offset + posts.length, totalPosts)} of {totalPosts} posts
      </div>
    </div>
  );
}
