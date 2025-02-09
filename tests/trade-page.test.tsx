import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradePage, { generateMetadata } from '../src/app/trades/[slug]/page';
import * as database from '@/utils/database';
import * as supabaseBlog from '@/utils/supabase-blog';
import * as faqs from '@/data/faqs';
import * as schema from '@/utils/schema';

// Mock the database utilities
jest.mock('@/utils/database', () => ({
  getTradeBySlug: jest.fn(),
  getAllSubregions: jest.fn(),
}));

// Mock the blog utilities
jest.mock('@/utils/supabase-blog', () => ({
  getPostsByCategory: jest.fn(),
}));

// Mock the FAQ data
jest.mock('@/data/faqs', () => ({
  getFAQsForTrade: jest.fn(),
}));

// Mock the schema utilities
jest.mock('@/utils/schema', () => ({
  generateLocalBusinessSchema: jest.fn(),
  generateBreadcrumbSchema: jest.fn(),
  generateFAQSchema: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock the components
jest.mock('@/components/SubregionList', () => ({
  SubregionList: ({ subregions, tradeName }: any) => (
    <nav data-testid="subregion-list" aria-label="Service areas">
      <h2>{tradeName} Service Areas</h2>
      {subregions.map((s: any) => (
        <div key={s.id}>{s.subregion_name}</div>
      ))}
    </nav>
  ),
}));

jest.mock('@/components/breadcrumb', () => ({
  __esModule: true,
  default: () => <nav data-testid="breadcrumb" aria-label="Breadcrumb" />,
}));

jest.mock('@/components/FAQSection', () => ({
  FAQSection: ({ category }: any) => (
    <section data-testid="faq-section">
      <h2>FAQs about {category}</h2>
    </section>
  ),
}));

jest.mock('@/components/BlogPostCard', () => ({
  BlogPostCard: ({ post }: any) => (
    <article data-testid="blog-post-card">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </article>
  ),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('TradePage', () => {
  const mockTrade = {
    id: '1',
    category_name: 'Bathroom Remodelers',
    slug: 'bathroom-remodelers',
    created_at: '2025-01-09T14:56:32Z',
    updated_at: '2025-01-09T14:56:32Z'
  };

  const mockSubregions = [
    {
      id: '1',
      subregion_name: 'Denver Tech Center',
      slug: 'denver-tech-center',
      created_at: '2025-01-09T14:56:32Z',
      updated_at: '2025-01-09T14:56:32Z'
    }
  ];

  const mockPosts = [
    {
      id: '1',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      excerpt: 'Test excerpt',
      feature_image: 'test.jpg',
      published_at: '2025-01-09T14:56:32Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (database.getTradeBySlug as jest.Mock).mockResolvedValue(mockTrade);
    (database.getAllSubregions as jest.Mock).mockResolvedValue(mockSubregions);
    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue({ posts: mockPosts });
    (faqs.getFAQsForTrade as jest.Mock).mockReturnValue([]);
    (schema.generateLocalBusinessSchema as jest.Mock).mockReturnValue({});
    (schema.generateBreadcrumbSchema as jest.Mock).mockReturnValue({});
    (schema.generateFAQSchema as jest.Mock).mockReturnValue({});
  });

  it('renders trade page with correct trade and subregion information', async () => {
    const page = await TradePage({ params: { slug: 'bathroom-remodelers' } });
    render(page);

    // Check main heading
    expect(screen.getByRole('heading', { name: 'Bathroom Remodelers Services in Denver', level: 1 })).toBeInTheDocument();

    // Check navigation and sections
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Service areas' })).toBeInTheDocument();
    expect(screen.getByText('Denver Tech Center')).toBeInTheDocument();

    // Check blog post section
    const blogPost = screen.getByTestId('blog-post-card');
    expect(blogPost).toBeInTheDocument();
    expect(within(blogPost).getByText('Test Blog Post')).toBeInTheDocument();
    expect(within(blogPost).getByText('Test excerpt')).toBeInTheDocument();

    // Check FAQ section
    expect(screen.getByTestId('faq-section')).toBeInTheDocument();
  });

  it('calls notFound when trade is not found', async () => {
    (database.getTradeBySlug as jest.Mock).mockResolvedValue(null);
    await TradePage({ params: { slug: 'non-existent' } });
    expect(require('next/navigation').notFound).toHaveBeenCalled();
  });

  it('generates correct metadata', async () => {
    const metadata = await generateMetadata({ params: { slug: 'bathroom-remodelers' } });
    
    expect(metadata.title).toBe('Bathroom Remodelers in Denver | Top-Rated Local Contractors');
    expect(metadata.description).toContain('Find trusted Bathroom Remodelers in the Denver area');
    expect(metadata.openGraph?.title).toBe('Bathroom Remodelers in Denver | Top-Rated Local Contractors');
    expect(metadata.openGraph?.images?.[0].url).toBe('https://topcontractorsdenver.com/images/denver-skyline.jpg');
  });
});
