# Hashnode Blog Integration

This directory contains the Hashnode blog integration for Top Contractors Denver. The implementation uses Hashnode's GraphQL API to fetch and display blog posts.

## Structure

```
blog/
├── [slug]/              # Individual blog post pages
│   ├── page.tsx         # Blog post display
│   └── loading.tsx      # Loading state for blog posts
├── page.tsx             # Blog listing page
├── loading.tsx          # Loading state for blog listing
├── error.tsx            # Error handling component
├── not-found.tsx        # 404 page for missing posts
└── README.md            # This documentation
```

## Components

- `PostCard`: Displays blog post previews in the listing page
- `PostContent`: Renders full blog post content
- `Loading`: Shows loading states while content is being fetched
- `Error`: Handles and displays error states
- `NotFound`: Displays 404 page for missing content

## Configuration

To use this blog system, you need to set up the following environment variables:

```env
HASHNODE_API_KEY=your_api_key_here
HASHNODE_PUBLICATION_ID=your_publication_id_here
```

## Features

- Server-side rendering with Next.js
- Incremental Static Regeneration (revalidates every hour)
- Responsive image handling
- Loading states
- Error boundaries
- SEO optimization
- TypeScript support

## API Integration

The blog uses Hashnode's GraphQL API to fetch:
- Blog post listings
- Individual blog posts
- Post metadata
- Author information
- Tags

## Usage

1. Create content on Hashnode
2. Posts will automatically appear on the blog
3. Content is cached and revalidated hourly
4. SEO metadata is automatically generated

## Error Handling

The system includes comprehensive error handling:
- Loading states for better UX
- Error boundaries for graceful failure
- Not found pages for missing content
- Network error recovery

## Performance

- Images are optimized using Next.js Image component
- Content is cached and revalidated
- Loading states prevent layout shift
- Responsive design for all screen sizes
