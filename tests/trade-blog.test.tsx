import { render, screen } from '@testing-library/react';
import TradeBlogPage from '@/app/blog/trades/tradeType/page';
import { notFound } from 'next/navigation';
import * as supabaseBlog from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';

jest.mock('@/utils/supabase-blog', () => ({
  getPostsByCategory: jest.fn()
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
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
      hasPrevPage: false
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    const { container } = render(await TradeBlogPage({ params, searchParams }));

    expect(supabaseBlog.getPostsByCategory).toHaveBeenCalledWith(
      'bathroom-remodeling',
      1
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(container.querySelector('article')).toBeInTheDocument();
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
      hasPrevPage: false
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    render(await TradeBlogPage({ params, searchParams }));

    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    expect(screen.getByText(/back to blog/i)).toBeInTheDocument();
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
      hasPrevPage: false
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    render(await TradeBlogPage({ params, searchParams }));

    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
  });
});
