// Define valid category type
export type ValidCategory = 
  | 'bathroom-remodeling'
  | 'decks'
  | 'electrical'
  | 'epoxy-garage'
  | 'fencing'
  | 'flooring'
  | 'home-remodeling'
  | 'hvac'
  | 'kitchen-remodeling'
  | 'landscaping'
  | 'masonry'
  | 'painting'
  | 'plumbing'
  | 'roofing'
  | 'siding-gutters'
  | 'windows';

// Standard categories from tradesData
export const standardCategories: Record<ValidCategory, boolean> = {
  'bathroom-remodeling': true,
  'decks': true,
  'electrical': true,
  'epoxy-garage': true,
  'fencing': true,
  'flooring': true,
  'home-remodeling': true,
  'hvac': true,
  'kitchen-remodeling': true,
  'landscaping': true,
  'masonry': true,
  'painting': true,
  'plumbing': true,
  'roofing': true,
  'siding-gutters': true,
  'windows': true
};

// Map all variations to standard categories
export const categoryMappings: Record<string, ValidCategory> = {
  // Bathroom variations
  'bathroom': 'bathroom-remodeling',
  'bathroom remodeling': 'bathroom-remodeling',
  'bathroom-remodeling': 'bathroom-remodeling',
  'bathtub': 'bathroom-remodeling',
  'shower': 'bathroom-remodeling',
  'tub': 'bathroom-remodeling',

  // Kitchen variations
  'kitchen': 'kitchen-remodeling',
  'kitchen remodeling': 'kitchen-remodeling',
  'kitchen-remodeling': 'kitchen-remodeling',

  // Home remodeling variations
  'remodeling': 'home-remodeling',
  'home-remodeling': 'home-remodeling',
  'general': 'home-remodeling',
  'renovation': 'home-remodeling',

  // Electrical variations
  'electrical': 'electrical',

  // HVAC variations
  'hvac': 'hvac',
  'heating': 'hvac',
  'cooling': 'hvac',
  'air conditioning': 'hvac',

  // Roofing variations
  'roofing': 'roofing',
  'roof': 'roofing',
  'shingles': 'roofing',
  'shingle': 'roofing',

  // Painting variations
  'painting': 'painting',
  'paint': 'painting',

  // Landscaping variations
  'landscaping': 'landscaping',
  'landscape': 'landscaping',
  'yard': 'landscaping',

  // Masonry variations
  'masonry': 'masonry',
  'stone': 'masonry',
  'brick': 'masonry',

  // Decks variations
  'decks': 'decks',
  'deck': 'decks',
  'decking': 'decks',

  // Flooring variations
  'flooring': 'flooring',
  'floor': 'flooring',
  'tile': 'flooring',

  // Windows variations
  'windows': 'windows',
  'window': 'windows',

  // Fencing variations
  'fencing': 'fencing',
  'fence': 'fencing',

  // Epoxy garage variations
  'epoxy-garage': 'epoxy-garage',
  'epoxy': 'epoxy-garage',
  'garage': 'epoxy-garage',

  // Siding variations
  'siding': 'siding-gutters',
  'siding-gutters': 'siding-gutters',
  'vinyl': 'siding-gutters',
  'gutters': 'siding-gutters'
};

export function normalizeCategory(category: string | null): ValidCategory | string {
  if (!category) return '';
  
  // Clean the input
  const normalized = category.trim().toLowerCase();
  
  // Return mapped category or original if no mapping exists
  return categoryMappings[normalized] || normalized;
}

// Utility function to check if a category is valid
export function isValidCategory(category: string): boolean {
  const normalized = normalizeCategory(category);
  return normalized in standardCategories;
}

// Utility function to get standard category from any variation
export function getStandardCategory(category: string | null): ValidCategory | null {
  if (!category) {
    console.log('getStandardCategory: category is null');
    return null;
  }
  
  console.log('getStandardCategory input:', category);
  const normalized = normalizeCategory(category);
  console.log('getStandardCategory normalized:', normalized);
  
  if (isValidCategory(normalized)) {
    console.log('getStandardCategory found valid category:', normalized);
    return normalized as ValidCategory;
  }
  
  console.log('getStandardCategory no valid category found');
  return null;
}
