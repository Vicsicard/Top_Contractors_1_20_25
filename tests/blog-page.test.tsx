import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page/[page]/page';
import { getPosts } from '@/utils/posts';
import { mockPost } from './setup';

jest.mock('@/utils/posts', () => ({
  getPosts: jest.fn()
}));

describe('BlogPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders blog posts correctly', async () => {
    (getPosts as jest.Mock).mockResolvedValue({
      posts: [mockPost],
      total: 1
    });

    render(
      <BlogPage 
        params={{ page: '1' }}
        searchParams={{}}
      />
    );

    const heading = await screen.findByText('Test Blog Post');
    expect(heading).toBeInTheDocument();
  });

  it('renders category filtered posts', async () => {
    (getPosts as jest.Mock).mockResolvedValue({
      posts: [mockPost],
      total: 1
    });

    render(
      <BlogPage 
        params={{ page: '1' }}
        searchParams={{ category: 'test-category' }}
      />
    );

    const heading = await screen.findByText('Test Blog Post');
    expect(heading).toBeInTheDocument();
  });

  it('handles no posts', async () => {
    (getPosts as jest.Mock).mockResolvedValue({
      posts: [],
      total: 0
    });

    render(
      <BlogPage 
        params={{ page: '1' }}
        searchParams={{}}
      />
    );

    // The component should render without posts but not crash
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
