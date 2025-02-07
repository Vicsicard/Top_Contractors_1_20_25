import React from 'react';
import { render } from '@testing-library/react';

// Mock the metadata component
jest.mock('next/metadata', () => ({
  Metadata: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('1')
  }),
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}));

// Helper function to render async server components
export async function renderServerComponent(Component: Promise<React.ReactElement>) {
  const ResolvedComponent = await Component;
  return render(ResolvedComponent);
}

// Helper function to create mock server components
export function createMockServerComponent(component: React.ReactElement) {
  return Promise.resolve(component);
}

// Mock data for testing
export const mockPost = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  html: '<p>Test content</p>',
  published_at: '2025-01-01',
  feature_image: '/test-image.jpg',
  feature_image_alt: 'Test Image',
  excerpt: 'Test excerpt',
  reading_time: 5,
  author: 'Test Author',
  author_url: '#',
  trade_category: 'bathroom-remodeling'
};

export const mockCategories = [
  {
    id: 'bathroom-remodeling',
    title: 'Bathroom Remodeling',
    description: 'Transform your bathroom'
  },
  {
    id: 'kitchen-remodeling',
    title: 'Kitchen Remodeling',
    description: 'Transform your kitchen'
  }
];
