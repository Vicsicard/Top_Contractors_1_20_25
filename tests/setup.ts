import '@testing-library/jest-dom';
import React from 'react';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Increase timeout for async tests
jest.setTimeout(10000);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...props }: any) {
    return React.createElement('img', {
      src,
      alt,
      ...props,
      fill: undefined,
      sizes: undefined
    });
  }
}));

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn()
};

const mockSearchParams = new URLSearchParams();
const mockPathname = '/blog';

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
  usePathname: () => mockPathname,
  notFound: jest.fn(),
  redirect: jest.fn()
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  })
}));

// Mock next/link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: function Link({ children, ...props }: any) {
      return React.createElement('a', props, children);
    }
  };
});

// Create reusable mock data
export const mockCategories = [
  {
    id: 'bathroom-remodeling',
    title: 'Bathroom Remodeling',
    description: 'Transform your bathroom with expert remodeling services.'
  },
  {
    id: 'kitchen-remodeling',
    title: 'Kitchen Remodeling',
    description: 'Expert kitchen renovation and remodeling services.'
  }
];

export const mockPost = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  html: '<p>This is a test blog post.</p>',
  published_at: '2025-01-01',
  feature_image: '/test-image.jpg',
  feature_image_alt: 'Test Image',
  excerpt: 'Test excerpt',
  reading_time: 5,
  author: 'Test Author',
  author_url: '#',
  trade_category: 'bathroom-remodeling'
};

export const mockPosts = {
  posts: [mockPost],
  total: 1
};

// Mock utils
jest.mock('@/utils/posts', () => ({
  getPosts: jest.fn().mockResolvedValue(mockPosts),
  getPostBySlug: jest.fn().mockResolvedValue({ post: mockPost })
}));

jest.mock('@/utils/categories', () => ({
  getAllCategories: jest.fn().mockResolvedValue(mockCategories)
}));

// Mock metadata
jest.mock('next/metadata', () => ({
  Metadata: jest.fn()
}));

// Mock React Server Components
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  createElement: jest.fn((type, props, ...children) => {
    if (type === 'script') return null;
    return jest.requireActual('react').createElement(type, props, ...children);
  }),
}));
