export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  data: Category[] | null;
  error: string | null;
}
