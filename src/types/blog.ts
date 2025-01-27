export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    html: string;
    feature_image?: string;
    feature_image_alt?: string;
    excerpt?: string;
    published_at: string;
    updated_at?: string;
    reading_time?: number;
    authors?: BlogAuthor[];
    tags?: BlogTag[];
}

export interface BlogTag {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface BlogAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image?: string;
    bio?: string;
    url?: string;
}

export interface PaginatedPosts {
    posts: BlogPost[];
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
