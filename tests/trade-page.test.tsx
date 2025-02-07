import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradePage, { generateMetadata } from '../src/app/trades/[slug]/page';
import * as database from '@/utils/database';
import * as supabaseBlog from '@/utils/supabase-blog';
import * as faqs from '@/data/faqs';
import * as schema from '@/utils/schema';
import { notFound } from 'next/navigation';

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
    },
    {
      id: '2',
      subregion_name: 'Cherry Creek',
      slug: 'cherry-creek',
      created_at: '2025-01-09T14:56:32Z',
      updated_at: '2025-01-09T14:56:32Z'
    }
  ];

  const mockPosts = {
    posts: [
      {
        id: '1',
        title: 'Bathroom Remodeling Tips',
        slug: 'bathroom-remodeling-tips',
        excerpt: 'Learn how to remodel your bathroom',
        feature_image: 'image.jpg',
        published_at: '2025-01-09T14:56:32Z'
      }
    ],
    total: 1
  };

  const mockFaqs = [
    {
      question: 'How much does bathroom remodeling cost?',
      answer: 'The cost varies depending on the scope of work.'
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (database.getTradeBySlug as jest.Mock).mockResolvedValue(mockTrade);
    (database.getAllSubregions as jest.Mock).mockResolvedValue(mockSubregions);
    (supabaseBlog.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);
    (faqs.getFAQsForTrade as jest.Mock).mockReturnValue(mockFaqs);
    (schema.generateLocalBusinessSchema as jest.Mock).mockReturnValue({});
    (schema.generateBreadcrumbSchema as jest.Mock).mockReturnValue({});
    (schema.generateFAQSchema as jest.Mock).mockReturnValue({});
  });

  describe('generateMetadata', () => {
    it('generates correct metadata for trade page', async () => {
      const params = { slug: 'bathroom-remodelers' };
      const metadata = await generateMetadata({ params });

      expect(metadata.title).toBe('Bathroom Remodelers in Denver | Top-Rated Local Contractors');
      expect(metadata.description).toContain('Find trusted Bathroom Remodelers in the Denver area');
    });

    it('throws error when trade is not found', async () => {
      (database.getTradeBySlug as jest.Mock).mockResolvedValue(null);
      const params = { slug: 'non-existent' };

      await expect(generateMetadata({ params })).rejects.toThrow('Trade not found');
    });
  });

  describe('TradePage component', () => {
    it('renders trade page with correct information', async () => {
      const params = { slug: 'bathroom-remodelers' };
      render(await TradePage({ params }));

      // Verify main heading
      expect(screen.getByRole('heading', { 
        name: 'Bathroom Remodelers Services in Denver',
        level: 1 
      })).toBeInTheDocument();

      // Verify subregions section
      expect(screen.getByRole('navigation', { name: 'Service areas' })).toBeInTheDocument();
      expect(screen.getByText('Denver Tech Center')).toBeInTheDocument();
      expect(screen.getByText('Cherry Creek')).toBeInTheDocument();

      // Verify benefits section
      expect(screen.getByRole('heading', { 
        name: 'Professional Bathroom Remodelers Services: Our Commitment to Quality',
        level: 2 
      })).toBeInTheDocument();
      expect(screen.getByText('Verified Customer Reviews')).toBeInTheDocument();
      expect(screen.getByText('Licensed & Insured Experts')).toBeInTheDocument();
      expect(screen.getByText('No-Cost Project Quotes')).toBeInTheDocument();

      // Verify blog posts section
      expect(screen.getByRole('heading', {
        name: 'Expert Bathroom Remodelers Tips & Project Guides',
        level: 2
      })).toBeInTheDocument();
      expect(screen.getByText('Bathroom Remodeling Tips')).toBeInTheDocument();
      const blogLink = screen.getByRole('link', {
        name: 'View all Bathroom Remodelers articles and guides'
      });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute('href', '/blog/trades/bathroom-remodelers');

      // Verify FAQ section is present
      expect(screen.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeInTheDocument();
      expect(screen.getByText('How much does bathroom remodeling cost?')).toBeInTheDocument();
    });

    it('calls notFound() when trade is not found', async () => {
      (database.getTradeBySlug as jest.Mock).mockResolvedValue(null);
      const params = { slug: 'non-existent-trade' };
      
      await TradePage({ params });
      expect(notFound).toHaveBeenCalled();
    });

    it('fetches data with correct parameters', async () => {
      const params = { slug: 'bathroom-remodelers' };
      await TradePage({ params });

      expect(database.getTradeBySlug).toHaveBeenCalledWith('bathroom-remodelers');
      expect(database.getAllSubregions).toHaveBeenCalled();
      expect(supabaseBlog.getPostsByCategory).toHaveBeenCalledWith('bathroom-remodelers');
      expect(faqs.getFAQsForTrade).toHaveBeenCalledWith('Bathroom Remodelers');
    });

    it('generates schema with correct data', async () => {
      const params = { slug: 'bathroom-remodelers' };
      await TradePage({ params });

      expect(schema.generateLocalBusinessSchema).toHaveBeenCalledWith({ 
        trade: 'Bathroom Remodelers' 
      });
      expect(schema.generateBreadcrumbSchema).toHaveBeenCalledWith({ 
        trade: 'Bathroom Remodelers' 
      });
      expect(schema.generateFAQSchema).toHaveBeenCalledWith(mockFaqs);
    });
  });
});
