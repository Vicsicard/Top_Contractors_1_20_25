// Standard tags that match our trade categories
export type ValidTag = 
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

// Map variations of tag names to our standard tags
const tagMappings: Record<string, ValidTag> = {
  // Bathroom variations
  'bathroom': 'bathroom remodeling',
  'bathrooms': 'bathroom remodeling',
  'bathroom remodeling': 'bathroom remodeling',
  'bathroom remodel': 'bathroom remodeling',
  'bathroom renovation': 'bathroom remodeling',
  'bathroom renovations': 'bathroom remodeling',
  'bathroom update': 'bathroom remodeling',
  'bathroom upgrade': 'bathroom remodeling',
  'bathroom makeover': 'bathroom remodeling',
  'bathtub': 'bathroom remodeling',
  'shower': 'bathroom remodeling',
  'showerhead': 'bathroom remodeling',
  'shower head': 'bathroom remodeling',
  'tub': 'bathroom remodeling',
  'walk-in shower': 'bathroom remodeling',
  'walk in shower': 'bathroom remodeling',
  'bathroomredomeling': 'bathroom remodeling',
  'bathroomremodeling': 'bathroom remodeling',

  // Deck variations
  'deck': 'decks',
  'decks': 'decks',
  'deck building': 'decks',
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
  'epoxy': 'epoxy garage',
  'epoxy garage': 'epoxy garage',
  'garage floor': 'epoxy garage',
  'garage flooring': 'epoxy garage',
  'epoxy flooring': 'epoxy garage',

  // Fencing variations
  'fence': 'fencing',
  'fencing': 'fencing',
  'fence installation': 'fencing',
  'fence repair': 'fencing',
  'fence contractor': 'fencing',
  'privacy fence': 'fencing',

  // Flooring variations
  'floor': 'flooring',
  'flooring': 'flooring',
  'floors': 'flooring',
  'floor installation': 'flooring',
  'hardwood': 'flooring',
  'tile': 'flooring',
  'carpet': 'flooring',

  // Home remodeling variations
  'home remodeling': 'home remodeling',
  'home remodel': 'home remodeling',
  'home renovation': 'home remodeling',
  'house remodeling': 'home remodeling',
  'house renovation': 'home remodeling',
  'remodeling': 'home remodeling',
  'renovation': 'home remodeling',
  'homeremodeling': 'home remodeling',

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
  'kitchens': 'kitchen remodeling',
  'kitchen remodeling': 'kitchen remodeling',
  'kitchen remodel': 'kitchen remodeling',
  'kitchen renovation': 'kitchen remodeling',
  'kitchen renovations': 'kitchen remodeling',
  'kitchen update': 'kitchen remodeling',
  'kitchen upgrade': 'kitchen remodeling',
  'kitchenremodeling': 'kitchen remodeling',

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
  'sidinggutters': 'siding gutters',

  // Windows variations
  'window': 'windows',
  'windows': 'windows',
  'window installation': 'windows',
  'window replacement': 'windows',
  'window repair': 'windows',
  'glass': 'windows'
};

// Utility function to normalize text for comparison
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Get standard tag from any variation
export function getStandardTag(tag: string | null): ValidTag | null {
  if (!tag) return null;
  
  const normalizedTag = normalizeText(tag);
  return tagMappings[normalizedTag] || null;
}

// Get multiple standard tags from a title or description
export function getStandardTags(text: string): ValidTag[] {
  const words = text.toLowerCase().split(/\s+/);
  const tags = new Set<ValidTag>();

  // Try pairs of words first (e.g., "bathroom remodeling")
  for (let i = 0; i < words.length - 1; i++) {
    const pair = words[i] + ' ' + words[i + 1];
    const tag = getStandardTag(pair);
    if (tag) tags.add(tag);
  }

  // Try individual words
  for (const word of words) {
    const tag = getStandardTag(word);
    if (tag) tags.add(tag);
  }

  return Array.from(tags);
}
