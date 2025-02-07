'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Category {
  id: string;
  title: string;
  description: string;
}

interface CategoryListProps {
  activeCategory?: string;
  categories: Category[];
}

export function CategoryList({ activeCategory, categories }: CategoryListProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1';

  const getCategoryUrl = useCallback((categoryId?: string) => {
    if (!categoryId) {
      return `/blog/page/${currentPage}`;
    }
    return `/blog/page/${currentPage}?category=${categoryId}`;
  }, [currentPage]);

  const isActive = useCallback((categoryId?: string) => {
    if (!categoryId && !activeCategory) return true;
    return categoryId === activeCategory;
  }, [activeCategory]);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Trade Categories</h2>
      <div className="flex flex-wrap gap-4">
        <Link
          href={getCategoryUrl()}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            ${isActive() 
              ? 'bg-blue-600 text-white ring-2 ring-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            transition-colors duration-200
          `}
        >
          All Posts
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={getCategoryUrl(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              ${isActive(category.id)
                ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              transition-colors duration-200
            `}
            title={category.description}
          >
            {category.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
