import { Metadata } from 'next';
import { getPosts } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { generateBreadcrumbSchema } from '@/utils/schema';

export async function generateMetadata({ searchParams }: { searchParams?: { page?: string } }): Promise<Metadata> {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const totalPosts = (await getPosts(1, 1)).totalPosts;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  return {
    title: currentPage > 1 ? `Blog - Page ${currentPage} | Top Contractors Denver` : 'Blog | Top Contractors Denver',
    description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
    alternates: {
      canonical: currentPage === 1 ? '/blog/' : `/blog/?page=${currentPage}`,
    },
    openGraph: {
      title: currentPage > 1 ? `Blog - Page ${currentPage} | Top Contractors Denver` : 'Blog | Top Contractors Denver',
      description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
      url: currentPage === 1 ? '/blog/' : `/blog/?page=${currentPage}`,
      type: 'website',
    },
    ...(currentPage > 1 ? { 
      robots: {
        index: true,
        follow: true,
      }
    } : {}),
  };
}

const POSTS_PER_PAGE = 12;

interface Props {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPosts } = await getPosts(currentPage, POSTS_PER_PAGE);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog', current: true }
  ];

  // Blog collection schema
  const blogCollectionSchema = {
    '@type': 'CollectionPage',
    headline: 'Latest Articles',
    description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
    url: currentPage === 1 ? 'https://topcontractorsdenver.com/blog/' : `https://topcontractorsdenver.com/blog/?page=${currentPage}`,
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://topcontractorsdenver.com/',
      name: 'Top Contractors Denver',
    },
    // Add pagination information to structured data
    ...(currentPage < totalPages ? {
      'pagination': {
        '@type': 'SiteNavigationElement',
        'nextPage': `https://topcontractorsdenver.com/blog/?page=${currentPage + 1}`
      }
    } : {}),
    ...(currentPage > 1 ? {
      'pagination': {
        '@type': 'SiteNavigationElement',
        'previousPage': `https://topcontractorsdenver.com/blog/?page=${currentPage - 1}`
      }
    } : {})
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
      
      {/* Add next/prev link tags for pagination */}
      {currentPage > 1 && (
        <link rel="prev" href={`/blog/?page=${currentPage - 1}`} />
      )}
      {currentPage < totalPages && (
        <link rel="next" href={`/blog/?page=${currentPage + 1}`} />
      )}
      
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
      
      <BlogPostGrid 
        posts={posts} 
        currentPage={currentPage}
        totalPosts={totalPosts}
        postsPerPage={POSTS_PER_PAGE}
      />
    </main>
  );
}
