import { ValidCategory } from './category-mapper';

export function formatCategoryTitle(category: ValidCategory | string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryMetadata(category: ValidCategory | string) {
  const formattedCategory = formatCategoryTitle(category);
  
  return {
    title: `${formattedCategory} Articles | Top Contractors Denver`,
    description: `Read expert articles about ${formattedCategory.toLowerCase()} services in Denver. Tips, guides, and professional insights from experienced contractors.`,
    keywords: `${category}, denver ${category}, ${category} contractors, ${category} services denver`,
    image: 'https://6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io/f1738570015825x940388143865540100/FLUX.1-schnell',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: `${formattedCategory} Articles - Top Contractors Denver`
  };
}

export function getCategoryError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error types if needed
    return error.message;
  }
  return 'Failed to load posts. Please try again later.';
}
