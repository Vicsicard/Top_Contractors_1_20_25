import { render, screen } from '@testing-library/react';
import TradeBlogPage, { generateMetadata } from '@/app/blog/trades/tradeType/page';
import { notFound } from 'next/navigation';
import * as supabaseBlog from '@/utils/supabase-blog';

jest.mock('@/utils/supabase-blog', () => ({
  getPostsByCategory: jest.fn()
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

jest.mock('@/lib/trades-data', () => ({
  tradesData: {
    'bathroom-remodeling': {
      title: 'Bathroom Remodeling',
      description: 'Bathroom remodeling services'
    }
  }
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('TradeBlogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders trade blog page with posts', async () => {
    const mockPosts = {
      posts: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          feature_image: 'test-image-1.jpg',
          excerpt: 'Test excerpt 1',
          published_at: '2023-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Test Post 2',
          slug: 'test-post-2',
          feature_image: 'test-image-2.jpg',
          excerpt: 'Test excerpt 2',
          published_at: '2023-01-02T00:00:00.000Z'
        }
      ],
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      totalPosts: 2
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    const result = await TradeBlogPage({ params, searchParams });
    
    // Check if result is a redirect
    if ('redirect' in result) {
      expect(result.redirect.destination).toBeDefined();
      return;
    }

    const { container } = render(result);

    expect(supabaseBlog.getPostsByCategory).toHaveBeenCalledWith(
      'bathroom-remodeling',
      1
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Bathroom Remodeling Blog')).toBeInTheDocument();
    expect(screen.getByText('2 articles in this category')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('calls notFound when trade does not exist', async () => {
    const params = { trade: 'non-existent-trade' };
    const searchParams = { page: '1' };

    await TradeBlogPage({ params, searchParams });

    expect(notFound).toHaveBeenCalled();
  });

  it('shows no posts message when no posts are found', async () => {
    const mockPosts = {
      posts: [],
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      totalPosts: 0
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    const result = await TradeBlogPage({ params, searchParams });
    
    // Check if result is a redirect
    if ('redirect' in result) {
      expect(result.redirect.destination).toBeDefined();
      return;
    }

    const { container } = render(result);

    expect(screen.getByText('No blog posts found for this trade category')).toBeInTheDocument();
    expect(container.querySelector('.grid')).not.toBeInTheDocument();
  });

  it('renders pagination controls when there are multiple pages', async () => {
    const mockPosts = {
      posts: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          feature_image: 'test-image-1.jpg',
          excerpt: 'Test excerpt 1',
          published_at: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalPages: 2,
      hasNextPage: true,
      hasPrevPage: false,
      totalPosts: 3
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    const result = await TradeBlogPage({ params, searchParams });
    
    // Check if result is a redirect
    if ('redirect' in result) {
      expect(result.redirect.destination).toBeDefined();
      return;
    }

    const { container } = render(result);

    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('generates correct metadata for trade blog page', async () => {
      const params = { trade: 'bathroom-remodeling' };
      const metadata = await generateMetadata({ params, searchParams: {} });

      expect(metadata.title).toBe('Bathroom Remodeling Blog | Top Contractors Denver');
      expect(metadata.description).toContain('Read expert bathroom remodeling tips');
    });

    it('generates not found metadata for invalid trade', async () => {
      const params = { trade: 'invalid-trade' };
      const metadata = await generateMetadata({ params, searchParams: {} });

      expect(metadata.title).toBe('Trade Not Found | Top Contractors Denver Blog');
      expect(metadata.robots).toBe('noindex, nofollow');
    });
  });
});
