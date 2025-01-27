import { render, screen } from '@testing-library/react';
import TradeBlogPage from '@/app/blog/trades/[trade]/page';
import { notFound } from 'next/navigation';
import * as supabaseBlog from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';

jest.mock('@/utils/supabase-blog', () => ({
  getPostsByCategory: jest.fn()
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
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

    await TradeBlogPage({ params, searchParams });

    expect(supabaseBlog.getPostsByCategory).toHaveBeenCalledWith(
      'bathroom-remodeling',
      1
    );
  });

  it('calls notFound when trade does not exist', async () => {
    const params = { trade: 'non-existent-trade' };
    const searchParams = { page: '1' };

    await TradeBlogPage({ params, searchParams });

    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound when no posts are found', async () => {
    const mockPosts = {
      posts: [],
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    };

    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);

    const params = { trade: 'bathroom-remodeling' };
    const searchParams = { page: '1' };

    await TradeBlogPage({ params, searchParams });

    expect(notFound).toHaveBeenCalled();
  });
});
