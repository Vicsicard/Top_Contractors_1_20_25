import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { generateBreadcrumbSchema } from '@/utils/schema';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
  alternates: {
    canonical: '/blog/',
  },
  openGraph: {
    title: 'Blog | Top Contractors Denver',
    description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
    url: '/blog/',
    type: 'website',
  }
};

const POSTS_PER_PAGE = 12;

interface Props {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPosts, hasMore } = await getPosts(currentPage, POSTS_PER_PAGE);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog', current: true }
  ];

  // Blog collection schema
  const blogCollectionSchema = {
    '@type': 'CollectionPage',
    headline: 'Latest Articles',
    description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
    url: 'https://topcontractorsdenver.com/blog/',
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://topcontractorsdenver.com/',
      name: 'Top Contractors Denver',
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema(null, null);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [blogCollectionSchema, breadcrumbSchema]
          })
        }}
      />
      
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
      
      <BlogPostGrid 
        posts={posts} 
        currentPage={currentPage}
        totalPosts={totalPosts}
        postsPerPage={POSTS_PER_PAGE}
        hasMore={hasMore}
      />
    </main>
  );
}
