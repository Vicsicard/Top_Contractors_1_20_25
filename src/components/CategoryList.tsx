'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types/category';

const CATEGORY_EMOJIS: { [key: string]: string } = {
  'Plumbing': '🚰',
  'Electrical': '⚡',
  'HVAC': '❄️',
  'Roofing': '🏠',
  'Landscaping': '🌳',
  'Painting': '🎨',
  'Carpentry': '🔨',
  'Flooring': '🪑',
  'General Contractor': '👷',
  'Handyman': '🛠️',
  'Cleaning': '🧹',
  'Pest Control': '🐜',
  'Windows': '🪟',
  'Concrete': '🏗️',
  'Fencing': '🏡',
  'Drywall': '🏢',
  'Masonry': '🧱',
  'Solar': '☀️',
  'Tree Service': '🌲',
  'Garage Door': '🚪'
};

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  console.log('CategoryList rendering with categories:', 
    Array.isArray(categories) 
      ? `${categories.length} items, first few: ${JSON.stringify(categories.slice(0, 2))}`
      : `Invalid data: ${JSON.stringify(categories)}`
  );

  if (!Array.isArray(categories)) {
    console.error('Categories is not an array:', categories);
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Error: Invalid categories data</p>
        <p className="text-sm text-red-400">Received: {typeof categories}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    console.log('No categories found');
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-600">No categories available</p>
        <p className="text-sm text-yellow-500">Please try again later</p>
      </div>
    );
  }

  const getEmoji = (categoryName: string): string => {
    // Try to find an exact match first
    if (CATEGORY_EMOJIS[categoryName]) {
      return CATEGORY_EMOJIS[categoryName];
    }
    // If no exact match, try to find a partial match
    const key = Object.keys(CATEGORY_EMOJIS).find(k => 
      categoryName.toLowerCase().includes(k.toLowerCase())
    );
    return key ? CATEGORY_EMOJIS[key] : '🏠'; // Default emoji if no match found
  };

  try {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-primary-dark mb-8 text-center">
          Find Local Contractors By Service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services/${category.slug}`}
              className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100"
            >
              <div className="flex flex-col items-start space-y-2">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-2xl" role="img" aria-label={category.category_name}>
                    {getEmoji(category.category_name)}
                  </span>
                  <h3 className="text-xl font-semibold text-primary-dark">
                    {category.category_name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Find trusted {category.category_name.toLowerCase()} in Denver
                </p>
                <span className="text-accent-warm font-medium text-sm mt-2 flex items-center">
                  View Contractors
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering CategoryList:', error);
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Error rendering categories</p>
        <p className="text-sm text-red-400">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
