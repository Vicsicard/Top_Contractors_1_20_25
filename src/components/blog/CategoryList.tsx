'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllCategories, categoryToTitle, categoryToSlug } from '@/utils/categories';

export function CategoryList() {
  const categories = getAllCategories();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category')?.replace(/-/g, ' ');

  return (
    <nav className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Trade Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link
          href="/blog"
          className={`px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
            !currentCategory ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-gray-900 hover:text-blue-600">
            All Posts
          </div>
        </Link>
        {categories.map(category => (
          <Link
            key={category}
            href={`/blog?category=${categoryToSlug(category)}`}
            className={`px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
              currentCategory === category ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="text-gray-900 hover:text-blue-600">
              {categoryToTitle(category)}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
