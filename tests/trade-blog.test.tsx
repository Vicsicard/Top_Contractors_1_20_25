import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradeBlogPage from '@/app/blog/trades/[trade]/page';
import * as ghost from '@/utils/ghost';

// Mock the ghost utility functions
jest.mock('@/utils/ghost', () => ({
  getPostsByCategory: jest.fn(),
  extractPostCategory: jest.fn()
}));

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, fill, sizes, ...props }: any) => {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className}
        {...props}
        data-testid="next-image"
      />
    );
  }
}));

// Mock trades data
jest.mock('@/lib/trades-data', () => ({
  __esModule: true,
  tradesData: {
    hvac: {
      id: 'hvac',
      title: 'HVAC',
      metaTitle: 'HVAC Services',
      metaDescription: 'HVAC services description',
      heading: 'HVAC Services',
      subheading: 'Professional HVAC Services',
      description: 'HVAC services in Denver',
      benefits: ['24/7 Service'],
      services: ['Repair', 'Installation'],
      regionDescriptions: {},
      icon: '/icons/hvac.svg'
    }
  }
}));

describe('TradeBlogPage', () => {
  let mockPosts = [
    {
      id: '1',
      slug: 'test-post-1',
      title: 'Test Post 1',
      html: '<p>Test content 1</p>',
      feature_image: 'https://example.com/image1.jpg',
      feature_image_alt: 'Test image 1',
      excerpt: 'Test excerpt 1',
      published_at: '2025-01-20T12:00:00.000Z'
    },
    {
      id: '2',
      slug: 'test-post-2',
      title: 'Test Post 2',
      html: '<p>Test content 2</p>',
      feature_image: '/relative/image2.jpg',
      excerpt: 'Test excerpt 2',
      published_at: '2025-01-20T13:00:00.000Z'
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock getPostsByCategory to return test data
    (ghost.getPostsByCategory as jest.Mock).mockResolvedValue({
      posts: mockPosts,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    });
  });

  it('renders the trade blog page with posts', async () => {
    const trade = 'hvac';
    const props = {
      params: { trade },
      searchParams: {}
    };

    const page = await TradeBlogPage(props);
    render(page);

    // Check if trade title and description are rendered
    const title = screen.getByRole('heading', { name: /hvac blog/i });
    expect(title).toBeInTheDocument();
    
    // Check if posts are rendered
    expect(screen.getByRole('heading', { name: 'Test Post 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Post 2' })).toBeInTheDocument();
    
    // Check if excerpts are rendered
    expect(screen.getByText('Test excerpt 1')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt 2')).toBeInTheDocument();

    // Check if trade icon is rendered
    const icons = screen.getAllByTestId('next-image');
    expect(icons.some(icon => icon.getAttribute('src') === '/icons/hvac.svg')).toBe(true);
  });

  it('handles invalid trade parameter', async () => {
    const notFound = jest.requireMock('next/navigation').notFound;
    const props = {
      params: { trade: 'invalid-trade' },
      searchParams: {}
    };

    // Mock getPostsByCategory to return empty data for invalid trade
    (ghost.getPostsByCategory as jest.Mock).mockResolvedValue({
      posts: [],
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    });

    try {
      await TradeBlogPage(props);
    } catch (error) {
      // Expected error
    }
    expect(notFound).toHaveBeenCalled();
  });

  it('handles pagination correctly', async () => {
    // Mock getPostsByCategory to return paginated data
    (ghost.getPostsByCategory as jest.Mock).mockResolvedValue({
      posts: mockPosts,
      totalPages: 2,
      currentPage: 1,
      hasNextPage: true,
      hasPrevPage: false
    });

    const props = {
      params: { trade: 'hvac' },
      searchParams: { page: '1' }
    };

    const page = await TradeBlogPage(props);
    render(page);

    // Check if pagination controls are rendered
    const nextLink = screen.getByText('Next');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink.closest('a')).toHaveAttribute('href', '/blog/trades/hvac?page=2');
  });

  it('handles empty posts array', async () => {
    (ghost.getPostsByCategory as jest.Mock).mockResolvedValue({
      posts: [],
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    });

    const props = {
      params: { trade: 'hvac' },
      searchParams: {}
    };

    const page = await TradeBlogPage(props);
    render(page);

    expect(screen.getByText(/check back soon/i)).toBeInTheDocument();
  });

  it('validates image URLs correctly', async () => {
    const props = {
      params: { trade: 'hvac' },
      searchParams: {}
    };

    const page = await TradeBlogPage(props);
    render(page);

    // Check if images are rendered
    const images = screen.getAllByTestId('next-image');
    expect(images.length).toBeGreaterThan(0);

    // Check image URLs
    const imageUrls = images.map(img => img.getAttribute('src'));
    expect(imageUrls).toContain('https://example.com/image1.jpg');
    expect(imageUrls.some(url => url?.includes('/relative/image2.jpg'))).toBe(true);
  });
});
