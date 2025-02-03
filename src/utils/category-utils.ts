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
  };
}

export function getCategoryError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error types if needed
    return error.message;
  }
  return 'Failed to load posts. Please try again later.';
}
