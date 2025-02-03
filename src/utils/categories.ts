const TRADE_CATEGORIES = [
  'bathroom remodeling',
  'decks',
  'electrician',
  'epoxy garage',
  'fencing',
  'flooring',
  'home remodeling',
  'hvac',
  'kitchen remodeling',
  'landscaper',
  'masonry',
  'plumbing',
  'roofer',
  'siding gutters',
  'windows'
];

export function getAllCategories(): string[] {
  return TRADE_CATEGORIES;
}

export function categoryToTitle(category: string): string {
  // Split by space or hyphen to handle both formats
  return category
    .split(/[-\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function categoryToSlug(category: string): string {
  // Convert spaces to hyphens for URL-friendly slugs
  return category.toLowerCase().replace(/\s+/g, '-');
}
