import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { BlogPostCard, CategoryList, Pagination } from './__mocks__/components';

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock components
jest.mock('@/components/BlogPostCard', () => ({
  __esModule: true,
  default: BlogPostCard
}));

jest.mock('@/components/blog/CategoryList', () => ({
  CategoryList
}));

jest.mock('@/components/Pagination', () => ({
  Pagination
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

// Mock next/headers
jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  })
}));

// Mock metadata
jest.mock('next/metadata', () => ({
  Metadata: jest.fn()
}));

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
};

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  }
}));

// Increase timeout for async tests
jest.setTimeout(10000);
