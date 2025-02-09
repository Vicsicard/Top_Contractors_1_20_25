import React from 'react';
import { render, screen } from '@testing-library/react';
import { RelatedContent } from '@/components/RelatedContent';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  );
});

describe('RelatedContent', () => {
  const mockItems = [
    {
      title: 'Test Blog Post',
      href: '/blog/test-post',
      description: 'A test blog post',
      date: '2025-02-09',
      type: 'blog' as const
    },
    {
      title: 'Test Trade',
      href: '/trades/test-trade',
      description: 'A test trade service',
      type: 'trade' as const
    },
    {
      title: 'Test Video',
      href: '/videos/test-video',
      date: '2025-02-08',
      type: 'video' as const
    }
  ];

  it('renders the component with default title', () => {
    render(<RelatedContent items={mockItems} />);
    expect(screen.getByRole('heading', { name: 'Related Content', level: 2 })).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<RelatedContent items={mockItems} title="Custom Title" />);
    expect(screen.getByRole('heading', { name: 'Custom Title', level: 2 })).toBeInTheDocument();
  });

  it('renders all items with their titles and links', () => {
    render(<RelatedContent items={mockItems} />);
    mockItems.forEach(item => {
      const link = screen.getByTestId('link', { href: item.href });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
      expect(screen.getByRole('heading', { name: item.title, level: 3 })).toBeInTheDocument();
    });
  });

  it('renders descriptions when provided', () => {
    render(<RelatedContent items={mockItems} />);
    expect(screen.getByText('A test blog post')).toBeInTheDocument();
    expect(screen.getByText('A test trade service')).toBeInTheDocument();
  });

  it('renders dates when provided', () => {
    render(<RelatedContent items={mockItems} />);
    expect(screen.getByText('2025-02-09')).toBeInTheDocument();
    expect(screen.getByText('2025-02-08')).toBeInTheDocument();
  });

  it('renders correct icons based on content type', () => {
    render(<RelatedContent items={mockItems} />);
    const links = screen.getAllByTestId('link');
    expect(links).toHaveLength(mockItems.length);
    expect(links[0]).toHaveAttribute('href', '/blog/test-post');
    expect(links[1]).toHaveAttribute('href', '/trades/test-trade');
    expect(links[2]).toHaveAttribute('href', '/videos/test-video');
  });
});
