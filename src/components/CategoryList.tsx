'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types/category';
import {
  Droplets, Zap, Wind, Home, Leaf, Paintbrush, Hammer, LayoutGrid,
  HardHat, Wrench, Sparkles, Bug, AppWindow, Building2, SeparatorHorizontal,
  Layers, Boxes, Sun, TreePine, DoorOpen, ChevronRight
} from 'lucide-react';

const CATEGORY_ICONS: { [key: string]: React.ElementType } = {
  'Plumbing': Droplets,
  'Electrical': Zap,
  'HVAC': Wind,
  'Roofing': Home,
  'Landscaping': Leaf,
  'Painting': Paintbrush,
  'Carpentry': Hammer,
  'Flooring': LayoutGrid,
  'General Contractor': HardHat,
  'Handyman': Wrench,
  'Cleaning': Sparkles,
  'Pest Control': Bug,
  'Windows': AppWindow,
  'Concrete': Building2,
  'Fencing': SeparatorHorizontal,
  'Drywall': Layers,
  'Masonry': Boxes,
  'Solar': Sun,
  'Tree Service': TreePine,
  'Garage Door': DoorOpen,
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

  const getIcon = (categoryName: string): React.ElementType => {
    if (CATEGORY_ICONS[categoryName]) return CATEGORY_ICONS[categoryName];
    const key = Object.keys(CATEGORY_ICONS).find(k =>
      categoryName.toLowerCase().includes(k.toLowerCase())
    );
    return key ? CATEGORY_ICONS[key] : Home;
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
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-blue-50 rounded-lg text-primary">
                    {React.createElement(getIcon(category.category_name), { size: 22, strokeWidth: 1.75 })}
                  </div>
                  <h3 className="text-xl font-semibold text-primary-dark">
                    {category.category_name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Find trusted {category.category_name.toLowerCase()} in Denver
                </p>
                <span className="text-accent-warm font-medium text-sm mt-2 flex items-center gap-1">
                  View Contractors
                  <ChevronRight size={15} />
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
