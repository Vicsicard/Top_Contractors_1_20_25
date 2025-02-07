import { render, screen } from '@testing-library/react';
import BlogPost from '@/app/blog/trades/[trade]/[slug]/page';
import { notFound } from 'next/navigation';
import * as postsUtils from '@/utils/posts';

jest.mock('@/utils/posts', () => ({
  getPostBySlug: jest.fn()
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('BlogPost', () => {
  const mockPost = {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the blog post correctly', async () => {
    (postsUtils.getPostBySlug as jest.Mock).mockResolvedValue({ post: mockPost });

    const Component = await BlogPost({
      params: {
        trade: 'bathroom-remodeling',
        slug: 'test-blog-post'
      }
    });

    render(Component);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post.')).toBeInTheDocument();
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(postsUtils.getPostBySlug).toHaveBeenCalledWith('test-blog-post', 'bathroom-remodeling');
  });

  it('calls notFound when post is not found', async () => {
    (postsUtils.getPostBySlug as jest.Mock).mockResolvedValue({ post: null });

    await BlogPost({
      params: {
        trade: 'bathroom-remodeling',
        slug: 'non-existent-post'
      }
    });

    expect(notFound).toHaveBeenCalled();
  });

  it('renders error message when post has no content', async () => {
    const emptyPost = {
      ...mockPost,
      html: ''
    };

    (postsUtils.getPostBySlug as jest.Mock).mockResolvedValue({ post: emptyPost });

    const Component = await BlogPost({
      params: {
        trade: 'bathroom-remodeling',
        slug: 'test-blog-post'
      }
    });

    render(Component);

    expect(screen.getByText('Content not available')).toBeInTheDocument();
  });
});
