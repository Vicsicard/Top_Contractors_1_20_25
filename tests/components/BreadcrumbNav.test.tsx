import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('BreadcrumbNav', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Post Title', href: '/blog/post-title' }
  ];

  it('renders all breadcrumb items', () => {
    render(<BreadcrumbNav items={mockItems} />);
    mockItems.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('renders correct number of separators', () => {
    render(<BreadcrumbNav items={mockItems} />);
    // Should have one less separator than items
    const separators = screen.getAllByRole('presentation');
    expect(separators).toHaveLength(mockItems.length - 1);
  });

  it('marks the last item as current page', () => {
    render(<BreadcrumbNav items={mockItems} />);
    const lastItem = screen.getByText(mockItems[mockItems.length - 1].label);
    expect(lastItem.closest('a')).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark other items as current page', () => {
    render(<BreadcrumbNav items={mockItems} />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).not.toHaveAttribute('aria-current');
  });

  it('renders correct links for each item', () => {
    render(<BreadcrumbNav items={mockItems} />);
    mockItems.forEach(item => {
      const link = screen.getByText(item.label).closest('a');
      expect(link).toHaveAttribute('href', item.href);
    });
  });

  it('renders with correct ARIA label', () => {
    render(<BreadcrumbNav items={mockItems} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });
});
