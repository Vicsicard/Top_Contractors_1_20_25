'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllCategories } from '@/utils/categories';

export function CategoryList() {
  const categories = getAllCategories();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Trade Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/blog"
          className={`group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${
            !currentCategory ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
              All Posts
            </h3>
            <p className="text-gray-600 text-sm">
              Browse all articles across every home improvement category
            </p>
          </div>
        </Link>

        {categories.map(category => (
          <Link
            key={category.id}
            href={`/blog?category=${category.id}`}
            className={`group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ${
              currentCategory === category.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
