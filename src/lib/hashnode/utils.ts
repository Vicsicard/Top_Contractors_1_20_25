// Map of trade categories to their corresponding Hashnode tag slugs
export const TRADE_CATEGORIES = {
  'bathroom-remodeling': 'bathroom-remodeling',
  'decks': 'decks',
  'electrician': 'electrician',
  'epoxy-garage': 'epoxy-garage',
  'fencing': 'fencing',
  'flooring': 'flooring',
  'home-remodeling': 'home-remodeling',
  'hvac': 'hvac',
  'kitchen-remodeling': 'kitchen-remodeling',
  'landscaper': 'landscaping',
  'masonry': 'masonry',
  'painter': 'painting',
  'plumbing': 'plumbing',
  'roofer': 'roofing',
  'siding': 'siding',
  'windows': 'windows'
} as const;

export type TradeCategory = keyof typeof TRADE_CATEGORIES;

// Convert a category slug to title case for display
export function categoryToTitle(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Validate if a category exists
export function isValidCategory(category: string): category is TradeCategory {
  return category in TRADE_CATEGORIES;
}

// Get the Hashnode tag slug for a category
export function getCategoryTag(category: TradeCategory): string {
  return TRADE_CATEGORIES[category];
}

// Get all valid trade categories
export function getAllCategories(): TradeCategory[] {
  return Object.keys(TRADE_CATEGORIES) as TradeCategory[];
}
