import Link from 'next/link';
import { BlogPostCard } from '@/components/BlogPostCard';
import type { Post } from '@/types/blog';

interface BlogPostGridProps {
  posts: Post[];
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
}

export function BlogPostGrid({ posts, currentPage, totalPosts, postsPerPage }: BlogPostGridProps) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Function to generate pagination links with ellipsis for better UX
  const getPaginationLinks = () => {
    const links = [];
    
    // Always show first page
    links.push(
      <Link
        key={1}
        href={`/blog${1 === 1 ? '' : `?page=${1}`}`}
        className={`px-4 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        1
      </Link>
    );
    
    // Add ellipsis if needed
    if (currentPage > 4) {
      links.push(
        <span key="ellipsis-1" className="px-2">
          ...
        </span>
      );
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <Link
          key={i}
          href={`/blog${i === 1 ? '' : `?page=${i}`}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 3) {
      links.push(
        <span key="ellipsis-2" className="px-2">
          ...
        </span>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      links.push(
        <Link
          key={totalPages}
          href={`/blog?page=${totalPages}`}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {totalPages}
        </Link>
      );
    }
    
    return links;
  };
  
  // Add previous and next buttons
  const renderPrevNextButtons = () => {
    return (
      <>
        {currentPage > 1 && (
          <Link
            href={`/blog${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 mr-2"
            aria-label="Previous page"
          >
            &laquo; Prev
          </Link>
        )}
        
        {currentPage < totalPages && (
          <Link
            href={`/blog?page=${currentPage + 1}`}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 ml-2"
            aria-label="Next page"
          >
            Next &raquo;
          </Link>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Improved Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {renderPrevNextButtons()}
          {getPaginationLinks()}
          {renderPrevNextButtons()}
        </div>
      )}

      <div className="mt-8 text-center text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
