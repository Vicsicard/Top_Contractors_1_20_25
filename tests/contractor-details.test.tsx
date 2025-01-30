import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContractorCard } from '../src/components/contractor-card';

// Mock heroicons
jest.mock('@heroicons/react/20/solid', () => ({
  StarIcon: () => <div data-testid="star-icon" />,
  PhoneIcon: () => <div data-testid="phone-icon" />,
  GlobeAltIcon: () => <div data-testid="globe-icon" />,
  MapPinIcon: () => <div data-testid="map-pin-icon" />
}));

describe('ContractorCard', () => {
  const mockContractor = {
    id: '1',
    category_id: 'cat-1',
    subregion_id: 'sub-1',
    contractor_name: 'ABC Remodeling',
    address: '123 Tech Center Dr, Denver, CO',
    phone: '303-555-0123',
    website: 'https://abcremodeling.com',
    google_rating: 4.8,
    google_review_count: 150,
    slug: 'abc-remodeling'
  };

  it('displays contractor name and address with correct icons', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    expect(screen.getByText('ABC Remodeling')).toBeInTheDocument();
    expect(screen.getByText('123 Tech Center Dr, Denver, CO')).toBeInTheDocument();
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
  });

  it('displays contact information with correct icons', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    const phoneLink = screen.getByText('303-555-0123');
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:303-555-0123');
    expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
    
    const websiteLink = screen.getByText('Visit Website');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'https://abcremodeling.com');
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
  });

  it('displays review information with star icons', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    expect(screen.getByText('(150 reviews)')).toBeInTheDocument();
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5);
  });

  it('handles missing optional information gracefully', () => {
    const contractorWithoutOptionals = {
      ...mockContractor,
      phone: null,
      website: null,
      google_review_count: undefined,
      reviews_count: 75
    };

    render(<ContractorCard contractor={contractorWithoutOptionals} />);
    
    expect(screen.queryByTestId('phone-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('globe-icon')).not.toBeInTheDocument();
    expect(screen.getByText('(75 reviews)')).toBeInTheDocument();
  });

  it('uses reviews_count when google_review_count is not available', () => {
    const contractorWithReviewsCount = {
      ...mockContractor,
      google_review_count: undefined,
      reviews_count: 100
    };

    render(<ContractorCard contractor={contractorWithReviewsCount} />);
    expect(screen.getByText('(100 reviews)')).toBeInTheDocument();
  });

  it('displays zero reviews when no review counts are available', () => {
    const contractorWithNoReviews = {
      ...mockContractor,
      google_review_count: undefined,
      reviews_count: undefined,
      google_rating: 0
    };

    render(<ContractorCard contractor={contractorWithNoReviews} />);
    expect(screen.getByText('(0 reviews)')).toBeInTheDocument();
  });

  it('applies responsive text classes', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    const name = screen.getByText('ABC Remodeling');
    expect(name.parentElement).toHaveClass('text-lg', 'sm:text-xl');
    
    const address = screen.getByText('123 Tech Center Dr, Denver, CO');
    expect(address.parentElement).toHaveClass('text-sm', 'sm:text-base');
  });

  it('applies hover effects to contact links', () => {
    render(<ContractorCard contractor={mockContractor} />);
    
    const phoneLink = screen.getByText('303-555-0123').parentElement;
    expect(phoneLink).toHaveClass('hover:text-blue-600');
    
    const websiteLink = screen.getByText('Visit Website');
    expect(websiteLink).toHaveClass('hover:text-blue-800');
  });

  it('applies transition effects to card', () => {
    const { container } = render(<ContractorCard contractor={mockContractor} />);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });
});
