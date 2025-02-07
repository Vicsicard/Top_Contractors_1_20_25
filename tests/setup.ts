import '@testing-library/jest-dom';
import React from 'react';
import { ImageProps } from 'next/image';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Increase timeout for database tests
jest.setTimeout(10000);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // Ensure src starts with / or http
    const imgSrc = typeof props.src === 'string' && !props.src.startsWith('/') && !props.src.startsWith('http')
      ? `/${props.src}`
      : props.src;
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', {
      ...props,
      src: imgSrc,
      alt: props.alt,
      // Convert boolean props to strings
      fill: props.fill ? 'true' : undefined,
      priority: props.priority ? 'true' : undefined
    });
  }
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    };
  },
  useSearchParams() {
    return {
      get: jest.fn()
    };
  },
  notFound: jest.fn()
}));

// Create reusable mock data
const mockTradeData = {
  id: '1',
  category_name: 'Bathroom Remodelers',
  slug: 'bathroom-remodelers',
  created_at: '2025-01-09T14:56:32Z',
  updated_at: '2025-01-09T14:56:32Z'
};

const mockContractorData = {
  id: '1',
  contractor_name: 'Test Contractor',
  slug: 'test-contractor',
  google_rating: 4.5,
  google_review_count: 100,
  created_at: '2025-01-09T14:56:32Z',
  updated_at: '2025-01-09T14:56:32Z'
};

// Mock Supabase client with improved implementation
jest.mock('../src/lib/supabase', () => {
  const mockSelect = jest.fn().mockReturnValue({
    eq: jest.fn().mockImplementation((column: string, value: string) => {
      if (column === 'slug' && value === 'bathroom-remodelers') {
        return {
          single: jest.fn().mockResolvedValue({
            data: mockTradeData,
            error: null
          }),
          data: [mockTradeData],
          error: null
        };
      }
      if (column === 'trade_category' && value === 'bathroom-remodelers') {
        return {
          data: [mockContractorData],
          error: null
        };
      }
      return {
        data: [],
        error: null
      };
    }),
    order: jest.fn().mockResolvedValue({
      data: [mockTradeData],
      error: null
    })
  });

  const mockFrom = jest.fn().mockReturnValue({
    select: mockSelect
  });

  return {
    supabase: {
      from: mockFrom
    }
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
