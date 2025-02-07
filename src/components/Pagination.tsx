'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (page: number) => {
    return baseUrl.replace('[page]', page.toString());
  };

  const renderPageLink = (page: number, label?: string) => {
    const isCurrent = page === currentPage;
    const className = `px-4 py-2 text-sm font-medium rounded-md ${
      isCurrent
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

    return (
      <Link
        key={page}
        href={getPageUrl(page)}
        className={className}
        aria-current={isCurrent ? 'page' : undefined}
      >
        {label || page}
      </Link>
    );
  };

  const pages = [];
  
  // Previous page
  if (currentPage > 1) {
    pages.push(
      <Link
        key="prev"
        href={getPageUrl(currentPage - 1)}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
      >
        Previous
      </Link>
    );
  }

  // First page
  pages.push(renderPageLink(1));

  // Dots or pages
  if (totalPages > 5) {
    if (currentPage > 3) {
      pages.push(
        <span key="dots1" className="px-4 py-2 text-gray-500">
          ...
        </span>
      );
    }

    // Current page range
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(renderPageLink(i));
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots2" className="px-4 py-2 text-gray-500">
          ...
        </span>
      );
    }
  } else {
    // Show all pages if total is 5 or less
    for (let i = 2; i < totalPages; i++) {
      pages.push(renderPageLink(i));
    }
  }

  // Last page
  if (totalPages > 1) {
    pages.push(renderPageLink(totalPages));
  }

  // Next page
  if (currentPage < totalPages) {
    pages.push(
      <Link
        key="next"
        href={getPageUrl(currentPage + 1)}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
      >
        Next
      </Link>
    );
  }

  return (
    <nav className="flex justify-center space-x-2" aria-label="Pagination">
      {pages}
    </nav>
  );
}
