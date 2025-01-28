-- Create posts table if it doesn't exist
create table if not exists posts (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text not null unique,
    html text not null,
    feature_image text,
    feature_image_alt text,
    excerpt text,
    published_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    reading_time integer,
    trade_category text,
    created_at timestamp with time zone default current_timestamp
);

-- Create indexes for better query performance
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_trade_category on posts(trade_category);
create index if not exists idx_posts_published_at on posts(published_at);

-- Add comment to explain the table
comment on table posts is 'Blog posts for each trade category';

-- Add comments to explain each column
comment on column posts.id is 'Unique identifier for the post';
comment on column posts.title is 'Title of the blog post';
comment on column posts.slug is 'URL-friendly version of the title';
comment on column posts.html is 'HTML content of the blog post';
comment on column posts.feature_image is 'URL of the featured image';
comment on column posts.feature_image_alt is 'Alt text for the featured image';
comment on column posts.excerpt is 'Short summary of the blog post';
comment on column posts.published_at is 'When the post was published';
comment on column posts.updated_at is 'When the post was last updated';
comment on column posts.reading_time is 'Estimated reading time in minutes';
comment on column posts.trade_category is 'Category of trade this post belongs to';
comment on column posts.created_at is 'When the post was created';
