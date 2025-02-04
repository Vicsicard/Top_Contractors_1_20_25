export interface TradeCategory {
  id: string;
  title: string;
  description: string;
}

const TRADE_CATEGORIES: TradeCategory[] = [
  {
    id: 'bathroom-remodeling',
    title: 'Bathroom Remodeling',
    description: 'Transform your bathroom with expert remodeling services, from simple updates to complete renovations.'
  },
  {
    id: 'decks',
    title: 'Decks',
    description: 'Custom deck design and construction to create your perfect outdoor living space.'
  },
  {
    id: 'electrician',
    title: 'Electrician',
    description: 'Professional electrical services for installations, repairs, and upgrades to keep your home safe and powered.'
  },
  {
    id: 'epoxy-garage',
    title: 'Epoxy Garage',
    description: 'High-quality garage floor coatings that are durable, attractive, and easy to maintain.'
  },
  {
    id: 'fencing',
    title: 'Fencing',
    description: 'Custom fence installation and repair services to enhance your property\'s security and curb appeal.'
  },
  {
    id: 'flooring',
    title: 'Flooring',
    description: 'Expert installation of hardwood, tile, laminate, and other flooring materials for any room.'
  },
  {
    id: 'home-remodeling',
    title: 'Home Remodeling',
    description: 'Comprehensive home renovation services to transform your living spaces and increase your home\'s value.'
  },
  {
    id: 'hvac',
    title: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services to keep your home comfortable year-round.'
  },
  {
    id: 'kitchen-remodeling',
    title: 'Kitchen Remodeling',
    description: 'Create your dream kitchen with custom cabinets, countertops, and modern appliances.'
  },
  {
    id: 'landscaper',
    title: 'Landscaper',
    description: 'Professional landscape design and maintenance to enhance your outdoor environment.'
  },
  {
    id: 'masonry',
    title: 'Masonry',
    description: 'Expert stonework and masonry services for walls, patios, fireplaces, and more.'
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    description: 'Reliable plumbing services for repairs, installations, and maintenance of your home\'s water systems.'
  },
  {
    id: 'roofer',
    title: 'Roofer',
    description: 'Professional roofing services including repairs, replacements, and maintenance for all roof types.'
  },
  {
    id: 'siding-gutters',
    title: 'Siding & Gutters',
    description: 'Quality siding installation and gutter services to protect and beautify your home\'s exterior.'
  },
  {
    id: 'windows',
    title: 'Windows',
    description: 'Expert window installation and replacement services to improve your home\'s efficiency and appearance.'
  }
];

export function getAllCategories(): TradeCategory[] {
  return TRADE_CATEGORIES;
}

export function getCategoryById(id: string): TradeCategory | undefined {
  return TRADE_CATEGORIES.find(cat => cat.id === id);
}

export function categoryToSlug(category: TradeCategory | string): string {
  if (typeof category === 'string') {
    return category.toLowerCase().replace(/\s+/g, '-');
  }
  return category.id;
}
