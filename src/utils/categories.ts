const TRADE_CATEGORIES = [
  'bathroom-remodeling',
  'decks',
  'electrician',
  'epoxy-garage',
  'fencing',
  'flooring',
  'home-remodeling',
  'hvac',
  'kitchen-remodeling',
  'landscaper',
  'masonry',
  'plumbing',
  'roofer',
  'windows'
];

export function getAllCategories(): string[] {
  return TRADE_CATEGORIES;
}

export function categoryToTitle(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
