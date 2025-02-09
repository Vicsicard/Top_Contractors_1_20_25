import React from 'react';
import { render, screen } from '@testing-library/react';
import SitemapPage from '@/app/sitemap/page';
import { createClient } from '@/utils/supabase-server';
import { getAllTrades, getAllSubregions } from '@/utils/database';

// Mock the dependencies
jest.mock('@/utils/supabase-server', () => ({
  createClient: jest.fn()
}));

jest.mock('@/utils/database', () => ({
  getAllTrades: jest.fn(),
  getAllSubregions: jest.fn()
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('SitemapPage', () => {
  const mockTrades = [
    { name: 'Plumbing', slug: 'plumbing' },
    { name: 'Electrical', slug: 'electrical' }
  ];

  const mockSubregions = [
    { name: 'Denver', slug: 'denver' },
    { name: 'Aurora', slug: 'aurora' }
  ];

  const mockPosts = [
    {
      title: 'Test Post 1',
      slug: 'test-post-1',
      published_at: '2025-02-09T00:00:00Z'
    },
    {
      title: 'Test Post 2',
      slug: 'test-post-2',
      published_at: '2025-02-08T00:00:00Z'
    }
  ];

  const mockVideos = [
    {
      title: 'Test Video 1',
      id: '1',
      category: 'plumbing',
      created_at: '2025-02-09T00:00:00Z'
    },
    {
      title: 'Test Video 2',
      id: '2',
      category: 'electrical',
      created_at: '2025-02-08T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getAllTrades as jest.Mock).mockResolvedValue(mockTrades);
    (getAllSubregions as jest.Mock).mockResolvedValue(mockSubregions);
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce({ data: mockPosts })
                     .mockResolvedValueOnce({ data: mockVideos })
    });
  });

  it('renders the sitemap page title', async () => {
    render(await SitemapPage());
    expect(screen.getByRole('heading', { name: 'Site Map', level: 1 })).toBeInTheDocument();
  });

  it('renders main navigation links', async () => {
    render(await SitemapPage());
    const mainLinks = ['Home', 'Trades', 'Blog', 'Videos', 'About', 'Contact'];
    mainLinks.forEach(link => {
      expect(screen.getByRole('link', { name: new RegExp(link) })).toBeInTheDocument();
    });
  });

  it('renders trade services', async () => {
    render(await SitemapPage());
    mockTrades.forEach(trade => {
      expect(screen.getByRole('link', { name: trade.name })).toBeInTheDocument();
    });
  });

  it('renders recent blog posts', async () => {
    render(await SitemapPage());
    mockPosts.forEach(post => {
      const link = screen.getByRole('link', { name: new RegExp(post.title) });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/blog/${post.slug}`);
    });
  });

  it('renders recent videos', async () => {
    render(await SitemapPage());
    mockVideos.forEach(video => {
      const link = screen.getByRole('link', { name: new RegExp(video.title) });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/videos/${video.category}/${video.id}`);
    });
  });

  it('includes view all links', async () => {
    render(await SitemapPage());
    expect(screen.getByRole('link', { name: 'View all blog posts →' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all videos →' })).toBeInTheDocument();
  });

  it('renders section headings', async () => {
    render(await SitemapPage());
    const sections = ['Main Pages', 'Trade Services', 'Recent Blog Posts', 'Recent Videos'];
    sections.forEach(section => {
      expect(screen.getByRole('heading', { name: section, level: 2 })).toBeInTheDocument();
    });
  });
});
