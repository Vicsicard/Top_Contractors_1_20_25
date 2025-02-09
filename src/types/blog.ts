export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    html: string;
    excerpt?: string;
    feature_image?: string;
    feature_image_alt?: string;
    authors?: string[];
    tags: Tag[];
    reading_time?: number;
    trade_category?: string;
    published_at: string;
    updated_at?: string;
}

export interface Author {
    id: string;
    name: string;
    slug: string;
    profile_image: string | null;
    bio: string | null;
    url: string | null;
}

export interface PaginatedPosts {
    posts: Post[];
    totalPosts: number;
    hasMore: boolean;
}
