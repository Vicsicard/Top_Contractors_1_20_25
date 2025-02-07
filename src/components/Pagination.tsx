import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Calculate page numbers to show
  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust start if we're near the end
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center my-8" aria-label="Pagination">
      <ul className="flex items-center gap-1">
        {/* Previous page */}
        {currentPage > 1 && (
          <li>
            <Link
              href={`${baseUrl}/page/${currentPage - 1}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
          </li>
        )}

        {/* First page if not in range */}
        {startPage > 1 && (
          <>
            <li>
              <Link
                href={`${baseUrl}/page/1`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1
              </Link>
            </li>
            {startPage > 2 && (
              <li>
                <span className="px-2 text-gray-500">...</span>
              </li>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <li key={page}>
            <Link
              href={`${baseUrl}/page/${page}`}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* Last page if not in range */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li>
                <span className="px-2 text-gray-500">...</span>
              </li>
            )}
            <li>
              <Link
                href={`${baseUrl}/page/${totalPages}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {/* Next page */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={`${baseUrl}/page/${currentPage + 1}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
