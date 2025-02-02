import Link from 'next/link';
import { getAllCategories, categoryToTitle } from '@/lib/hashnode/utils';

export function CategoryList() {
  const categories = getAllCategories();

  return (
    <nav className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Trade Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <Link
            key={category}
            href={`/blog/trades/${category}`}
            className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
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
