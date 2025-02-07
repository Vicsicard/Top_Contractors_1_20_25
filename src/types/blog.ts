export interface Post {
  id: string;
  title: string;
  slug: string;
  html: string;
  published_at: string;
  updated_at?: string;
  feature_image: string;
  feature_image_alt: string;
  excerpt: string;
  reading_time: number;
  author: string;
  author_url: string;
  trade_category: string;
  tags?: Tag[];
  authors?: Author[];
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
  url: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface PaginatedPosts {
  posts: Post[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPosts: number;
}
