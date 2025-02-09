import { render, screen } from '@testing-library/react';
import BlogPost from '../src/app/blog/trades/[category]/[slug]/page';
import { getPostBySlug } from '../src/utils/posts';
import { isValidCategory } from '../src/utils/category-mapper';

// Mock the dependencies
jest.mock('../src/utils/posts', () => ({
    getPostBySlug: jest.fn()
}));

jest.mock('../src/utils/category-mapper', () => ({
    isValidCategory: jest.fn(() => true)
}));

jest.mock('next/navigation', () => ({
    notFound: jest.fn()
}));

// Mock the BlogPostDisplay component
jest.mock('@/components/BlogPostDisplay', () => ({
    BlogPostDisplay: ({ post }: { post: any }) => (
        <article data-testid="blog-post-display">
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            {post.authors?.[0] && <div>{post.authors[0].name}</div>}
        </article>
    )
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
        trade_category: 'test-category'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the blog post correctly', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue({
            ...mockPost,
            trade_category: 'test-category'
        });
        (isValidCategory as jest.Mock).mockReturnValue(true);

        const page = await BlogPost({ params: { slug: 'test-blog-post', category: 'test-category' } });
        render(page);
        
        const postDisplay = screen.getByTestId('blog-post-display');
        expect(postDisplay).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Test Blog Post', level: 1 })).toBeInTheDocument();
        expect(postDisplay).toHaveTextContent('This is a test blog post.');
        expect(postDisplay).toHaveTextContent('Author Name');
    });

    it('calls notFound when category is invalid', async () => {
        (isValidCategory as jest.Mock).mockReturnValue(false);
        
        await BlogPost({ params: { slug: 'test-blog-post', category: 'invalid-category' } });
        expect(require('next/navigation').notFound).toHaveBeenCalled();
    });

    it('calls notFound when post is not found', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue(null);
        (isValidCategory as jest.Mock).mockReturnValue(true);
        
        await BlogPost({ params: { slug: 'non-existent-post', category: 'test-category' } });
        expect(require('next/navigation').notFound).toHaveBeenCalled();
    });

    it('calls notFound when post category does not match URL category', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue({
            ...mockPost,
            trade_category: 'different-category'
        });
        (isValidCategory as jest.Mock).mockReturnValue(true);
        
        await BlogPost({ params: { slug: 'test-blog-post', category: 'test-category' } });
        expect(require('next/navigation').notFound).toHaveBeenCalled();
    });

    it('generates correct metadata for existing post', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue(mockPost);
        const metadata = await require('../src/app/blog/trades/[category]/[slug]/page').generateMetadata({
            params: { slug: 'test-blog-post', category: 'test-category' }
        });

        expect(metadata.title).toBe('Test Blog Post | Top Contractors Denver Blog');
        expect(metadata.description).toBe('This is a test excerpt.');
        expect(metadata.robots).toEqual({ index: true, follow: true });
    });

    it('generates not found metadata for non-existent post', async () => {
        (getPostBySlug as jest.Mock).mockResolvedValue(null);
        const metadata = await require('../src/app/blog/trades/[category]/[slug]/page').generateMetadata({
            params: { slug: 'non-existent', category: 'test-category' }
        });

        expect(metadata.title).toBe('Post Not Found | Top Contractors Denver Blog');
        expect(metadata.description).toBe('The requested blog post could not be found.');
        expect(metadata.robots).toBe('noindex, nofollow');
    });
});
