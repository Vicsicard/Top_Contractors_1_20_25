-- Drop existing tables with CASCADE to handle dependencies
drop table if exists posts cascade;

-- Create posts table with all required columns
create table posts (
    id uuid primary key default uuid_generate_v4(),
    hashnode_id text unique,
    title text not null,
    slug text not null unique,
    html text not null,
    excerpt text,
    feature_image text,
    feature_image_alt text,
    authors jsonb default '[]'::jsonb,
    tags jsonb default '[]'::jsonb,
    reading_time integer,
    trade_category text,
    published_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    created_at timestamp with time zone default current_timestamp
);

-- Create indexes for better query performance
create index idx_posts_slug on posts(slug);
create index idx_posts_hashnode_id on posts(hashnode_id);
create index idx_posts_trade_category on posts(trade_category);
create index idx_posts_published_at on posts(published_at);

-- Add table and column comments
comment on table posts is 'Blog posts for each trade category';
comment on column posts.id is 'Unique identifier for the post';
comment on column posts.hashnode_id is 'Original Hashnode post ID for synced posts';
comment on column posts.title is 'Title of the blog post';
comment on column posts.slug is 'URL-friendly version of the title';
comment on column posts.html is 'HTML content of the blog post';
comment on column posts.excerpt is 'Short summary of the blog post';
comment on column posts.feature_image is 'URL of the featured image';
comment on column posts.feature_image_alt is 'Alt text for the featured image';
comment on column posts.authors is 'Array of author objects in JSONB format';
comment on column posts.tags is 'Array of tag objects in JSONB format';
comment on column posts.reading_time is 'Estimated reading time in minutes';
comment on column posts.trade_category is 'Category of trade this post belongs to';
comment on column posts.published_at is 'When the post was published';
comment on column posts.updated_at is 'When the post was last updated';
comment on column posts.created_at is 'When the post was created';
