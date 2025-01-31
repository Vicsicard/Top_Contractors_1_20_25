import { render, screen } from '@testing-library/react';
import BlogPost from '../src/app/blog/trades/[category]/[slug]/page';
import { getPostBySlug } from '../src/utils/supabase-blog';

// Mock the getPostBySlug function
jest.mock('../src/utils/supabase-blog', () => ({
    getPostBySlug: jest.fn(),
}));

describe('BlogPost', () => {
    const mockPost = {
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        html: '<p>This is a test blog post.</p>',
        published_at: '2025-01-01T00:00:00Z',
        reading_time: 5,
        feature_image: 'https://example.com/image.jpg',
        excerpt: 'This is a test excerpt.',
        authors: [{ name: 'Author Name', url: 'https://example.com/author' }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the blog post correctly', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);

        const { container } = render(<BlogPost params={{ slug: 'test-blog-post', category: 'test-category' }} />);
        
        expect(await screen.findByText('Test Blog Post')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('handles not found post', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue(null);

        const { container } = render(<BlogPost params={{ slug: 'non-existent-post', category: 'test-category' }} />);
        
        expect(await screen.findByText('Post Not Found | Top Contractors Denver Blog')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });
});
