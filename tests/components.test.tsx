import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContractorCard } from '../src/components/contractor-card';
import { TradeCard } from '../src/components/trade-card';

describe('Component Tests', () => {
  const mockContractor = {
    id: '1',
    category_id: 'cat-1',
    subregion_id: 'sub-1',
    contractor_name: 'Test Contractor',
    address: '123 Test St, Denver, CO',
    phone: '303-555-0123',
    website: 'https://example.com',
    reviews_avg: 4.5,
    reviews_count: 100,
    slug: 'test-contractor',
    created_at: '2025-01-09T14:56:32Z',
    updated_at: '2025-01-09T14:56:32Z',
    google_rating: 4.5,
    google_review_count: 100,
    category_slug: 'bathroom-remodelers',
    subregion_slug: 'denver-tech-center'
  };

  const mockTrade = {
    id: '1',
    category_name: 'Bathroom Remodelers',
    slug: 'bathroom-remodelers',
    created_at: '2025-01-09T14:56:32Z',
    updated_at: '2025-01-09T14:56:32Z'
  };

  const mockStats = {
    totalContractors: 10,
    totalReviews: 500,
    avgRating: 4.5
  };

  test('ContractorCard renders contractor information correctly', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    // Test contractor name
    expect(screen.getByRole('heading', { name: mockContractor.contractor_name })).toBeInTheDocument();
    
    // Test address with icon
    const addressElement = screen.getByText(mockContractor.address);
    expect(addressElement).toBeInTheDocument();
    expect(addressElement.parentElement?.querySelector('svg')).toBeInTheDocument();
    
    // Test phone with icon
    const phoneLink = screen.getByRole('link', { name: mockContractor.phone });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink.parentElement?.querySelector('svg')).toBeInTheDocument();
    
    // Test website link if present
    if (mockContractor.website) {
      const websiteLink = screen.getByRole('link', { name: 'Visit Website' });
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink.getAttribute('href')).toBe(mockContractor.website);
      expect(websiteLink.parentElement?.querySelector('svg')).toBeInTheDocument();
    }
    
    // Test rating stars
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
    
    // Test review count
    expect(screen.getByText(`(${mockContractor.google_review_count} reviews)`)).toBeInTheDocument();
  });

  test('TradeCard renders trade information correctly', () => {
    render(<TradeCard trade={mockTrade} stats={mockStats} />);
    
    expect(screen.getByText(mockTrade.category_name)).toBeInTheDocument();
    // Look for the number and text separately since they're in different elements
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Contractors')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
