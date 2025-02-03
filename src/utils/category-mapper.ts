// Define valid category type
export type ValidCategory = 
  | 'bathroom remodeling'
  | 'decks'
  | 'electrician'
  | 'epoxy garage'
  | 'fencing'
  | 'flooring'
  | 'home remodeling'
  | 'hvac'
  | 'kitchen remodeling'
  | 'landscaper'
  | 'masonry'
  | 'plumbing'
  | 'roofer'
  | 'siding gutters'
  | 'windows';

// Standard categories from tradesData
export const standardCategories: Record<ValidCategory, boolean> = {
  'bathroom remodeling': true,
  'decks': true,
  'electrician': true,
  'epoxy garage': true,
  'fencing': true,
  'flooring': true,
  'home remodeling': true,
  'hvac': true,
  'kitchen remodeling': true,
  'landscaper': true,
  'masonry': true,
  'plumbing': true,
  'roofer': true,
  'siding gutters': true,
  'windows': true
};

// Map all variations to standard categories
export const categoryMappings: Record<string, ValidCategory> = {
  // Bathroom variations
  'bathroom': 'bathroom remodeling',
  'bathroom remodeling': 'bathroom remodeling',
  'bathroom-remodeling': 'bathroom remodeling',
  'bathroom remodel': 'bathroom remodeling',
  'bathroom renovation': 'bathroom remodeling',
  'bathtub': 'bathroom remodeling',
  'shower': 'bathroom remodeling',
  'showerhead': 'bathroom remodeling',
  'shower head': 'bathroom remodeling',
  'tub': 'bathroom remodeling',
  'walk-in shower': 'bathroom remodeling',
  'walk-in bathtub': 'bathroom remodeling',
  'bath': 'bathroom remodeling',

  // Decks variations
  'decks': 'decks',
  'deck': 'decks',
  'deck builder': 'decks',
  'deck installation': 'decks',
  'deck repair': 'decks',
  'patio': 'decks',
  'porch': 'decks',

  // Electrician variations
  'electrician': 'electrician',
  'electrical': 'electrician',
  'electric': 'electrician',
  'wiring': 'electrician',
  'electrical contractor': 'electrician',
  'electrical service': 'electrician',

  // Epoxy garage variations
  'epoxy garage': 'epoxy garage',
  'epoxy-garage': 'epoxy garage',
  'epoxy': 'epoxy garage',
  'garage floor': 'epoxy garage',
  'garage flooring': 'epoxy garage',
  'epoxy flooring': 'epoxy garage',

  // Fencing variations
  'fencing': 'fencing',
  'fence': 'fencing',
  'fence installation': 'fencing',
  'fence repair': 'fencing',
  'fence contractor': 'fencing',
  'privacy fence': 'fencing',

  // Flooring variations
  'flooring': 'flooring',
  'floor': 'flooring',
  'floors': 'flooring',
  'floor installation': 'flooring',
  'hardwood': 'flooring',
  'tile': 'flooring',
  'carpet': 'flooring',

  // Home remodeling variations
  'home remodeling': 'home remodeling',
  'home-remodeling': 'home remodeling',
  'home remodel': 'home remodeling',
  'home renovation': 'home remodeling',
  'house remodeling': 'home remodeling',
  'remodeling': 'home remodeling',
  'renovation': 'home remodeling',

  // HVAC variations
  'hvac': 'hvac',
  'heating': 'hvac',
  'cooling': 'hvac',
  'air conditioning': 'hvac',
  'ac repair': 'hvac',
  'furnace': 'hvac',
  'air conditioner': 'hvac',

  // Kitchen variations
  'kitchen': 'kitchen remodeling',
  'kitchen remodeling': 'kitchen remodeling',
  'kitchen-remodeling': 'kitchen remodeling',
  'kitchen remodel': 'kitchen remodeling',
  'kitchen renovation': 'kitchen remodeling',
  'kitchen cabinets': 'kitchen remodeling',

  // Landscaper variations
  'landscaper': 'landscaper',
  'landscaping': 'landscaper',
  'landscape': 'landscaper',
  'yard': 'landscaper',
  'garden': 'landscaper',
  'lawn': 'landscaper',
  'outdoor': 'landscaper',

  // Masonry variations
  'masonry': 'masonry',
  'mason': 'masonry',
  'stone': 'masonry',
  'brick': 'masonry',
  'concrete': 'masonry',
  'block': 'masonry',

  // Plumbing variations
  'plumbing': 'plumbing',
  'plumber': 'plumbing',
  'pipes': 'plumbing',
  'pipe': 'plumbing',
  'drain': 'plumbing',
  'water heater': 'plumbing',

  // Roofer variations
  'roofer': 'roofer',
  'roofing': 'roofer',
  'roof': 'roofer',
  'roof repair': 'roofer',
  'roof replacement': 'roofer',
  'shingles': 'roofer',
  'shingle': 'roofer',

  // Siding and gutters variations
  'siding gutters': 'siding gutters',
  'siding-gutters': 'siding gutters',
  'siding': 'siding gutters',
  'gutters': 'siding gutters',
  'gutter': 'siding gutters',
  'siding installation': 'siding gutters',
  'gutter installation': 'siding gutters',

  // Windows variations
  'windows': 'windows',
  'window': 'windows',
  'window installation': 'windows',
  'window replacement': 'windows',
  'window repair': 'windows',
  'glass': 'windows'
};

// Utility function to normalize text for comparison
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Utility function to check if a category is valid
export function isValidCategory(category: string): boolean {
  return standardCategories[category as ValidCategory] === true;
}

// Utility function to normalize category name
export function normalizeCategory(category: string | null): string | null {
  if (!category) return null;
  return normalizeText(category);
}

// Utility function to get standard category from any variation
export function getStandardCategory(category: string | null): ValidCategory | null {
  if (!category) return null;
  const normalized = normalizeCategory(category);
  if (!normalized) return null;
  return categoryMappings[normalized] || null;
}
