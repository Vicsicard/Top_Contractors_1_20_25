import { screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page/[page]/page';
import { notFound } from 'next/navigation';
import * as postsUtils from '@/utils/posts';
import * as categoriesUtils from '@/utils/categories';
import { renderServerComponent } from './test-utils';

// Mock the posts and categories utils
jest.mock('@/utils/posts');
jest.mock('@/utils/categories');

describe('BlogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog posts correctly', async () => {
    const mockPosts = {
      posts: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          html: '<p>Test content</p>',
          published_at: '2025-01-01',
          feature_image: '/test-image-1.jpg',
          feature_image_alt: 'Test Image 1',
          excerpt: 'Test excerpt 1',
          reading_time: 5,
          author: 'Test Author',
          author_url: '#',
          trade_category: 'bathroom-remodeling'
        }
      ],
      total: 1
    };

    const mockCategories = [
      {
        id: 'bathroom-remodeling',
        title: 'Bathroom Remodeling',
        description: 'Transform your bathroom'
      }
    ];

    (postsUtils.getPosts as jest.Mock).mockResolvedValue(mockPosts);
    (categoriesUtils.getAllCategories as jest.Mock).mockResolvedValue(mockCategories);

    const page = await BlogPage({
      params: { page: '1' },
      searchParams: {}
    });

    const { container } = await renderServerComponent(Promise.resolve(page));

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt 1')).toBeInTheDocument();
    expect(screen.getByText('Bathroom Remodeling')).toBeInTheDocument();
    expect(container.querySelector('h1')?.textContent).toBe('Latest Articles');

    expect(postsUtils.getPosts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12
    });
  });

  it('handles category filtering', async () => {
    const mockPosts = {
      posts: [
        {
          id: '1',
          title: 'Test Post 1',
          slug: 'test-post-1',
          html: '<p>Test content</p>',
          published_at: '2025-01-01',
          feature_image: '/test-image-1.jpg',
          feature_image_alt: 'Test Image 1',
          excerpt: 'Test excerpt 1',
          reading_time: 5,
          author: 'Test Author',
          author_url: '#',
          trade_category: 'bathroom-remodeling'
        }
      ],
      total: 1
    };

    const mockCategories = [
      {
        id: 'bathroom-remodeling',
        title: 'Bathroom Remodeling',
        description: 'Transform your bathroom'
      }
    ];

    (postsUtils.getPosts as jest.Mock).mockResolvedValue(mockPosts);
    (categoriesUtils.getAllCategories as jest.Mock).mockResolvedValue(mockCategories);

    const page = await BlogPage({
      params: { page: '1' },
      searchParams: { category: 'bathroom-remodeling' }
    });

    const { container } = await renderServerComponent(Promise.resolve(page));

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(container.querySelector('h1')?.textContent).toBe('Bathroom Remodeling Articles');

    expect(postsUtils.getPosts).toHaveBeenCalledWith({
      page: 1,
      pageSize: 12,
      category: 'bathroom-remodeling'
    });
  });

  it('handles invalid page numbers', async () => {
    const page = await BlogPage({
      params: { page: 'invalid' },
      searchParams: {}
    });

    await renderServerComponent(Promise.resolve(page));
    expect(notFound).toHaveBeenCalled();
  });

  it('handles empty pages beyond first page', async () => {
    const mockPosts = {
      posts: [],
      total: 0
    };

    (postsUtils.getPosts as jest.Mock).mockResolvedValue(mockPosts);

    const page = await BlogPage({
      params: { page: '2' },
      searchParams: {}
    });

    await renderServerComponent(Promise.resolve(page));
    expect(notFound).toHaveBeenCalled();
  });
});
