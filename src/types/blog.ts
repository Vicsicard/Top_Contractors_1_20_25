export interface Post {
    id: string;
    title: string;
    slug: string;
    html: string;
    excerpt: string | null;
    feature_image: string | null;
    feature_image_alt: string | null;
    published_at: string;
    updated_at: string | null;
    reading_time: number | null;
    trade_category: string;
    authors: Author[];
    tags: Tag[];
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
}
