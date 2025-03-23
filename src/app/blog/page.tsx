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
      canonical: currentPage === 1 ? '/blog/' : `/blog/?page=${currentPage}/`,
    },
    openGraph: {
      title: currentPage > 1 ? `Blog - Page ${currentPage} | Top Contractors Denver` : 'Blog | Top Contractors Denver',
      description: 'Read the latest articles about home improvement, remodeling, and construction in Denver.',
      url: currentPage === 1 ? '/blog/' : `/blog/?page=${currentPage}/`,
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

const POSTS_PER_PAGE = 6;

interface Props {
  searchParams?: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: Props) {
  try {
    console.log('[DEBUG] Starting BlogPage component render');
    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    
    // Set a timeout to prevent serverless function timeouts
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Blog post fetching timed out'));
      }, 8000); // 8 seconds timeout (serverless functions often timeout at 10s)
    });
    
    // Race between the post fetching and the timeout
    console.log(`[DEBUG] Fetching posts for page ${currentPage} with timeout protection`);
    const postsPromise = getPosts(currentPage, POSTS_PER_PAGE);
    
    let posts: any[] = [];
    let totalPosts = 0;
    
    try {
      const result = await Promise.race([postsPromise, timeoutPromise]) as {
        posts: any[];
        totalPosts: number;
        hasMore: boolean;
      };
      posts = result.posts;
      totalPosts = result.totalPosts;
      console.log(`[DEBUG] Received ${posts.length} posts out of ${totalPosts} total posts`);
    } catch (error) {
      console.error('[ERROR] Error or timeout fetching posts:', error);
      // Return fallback data instead of failing completely
      posts = [];
      totalPosts = 0;
    }
    
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1; // Ensure at least 1 page

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

    console.log('[DEBUG] BlogPage component render completed successfully');
    
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
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No blog posts found</h2>
            <p className="text-gray-600 mb-4">
              We&apos;re experiencing technical difficulties loading our blog posts at the moment.
            </p>
            <p className="text-gray-600">
              Please try refreshing the page or check back later.
            </p>
          </div>
        ) : (
          <BlogPostGrid 
            posts={posts} 
            currentPage={currentPage}
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
          />
        )}
      </main>
    );
  } catch (error) {
    console.error('[ERROR] Error in BlogPage component:', error);
    // Return a fallback UI instead of throwing the error
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We&apos;re experiencing technical difficulties with our blog at the moment.
          </p>
          <p className="text-gray-600">
            Please try refreshing the page or check back later.
          </p>
        </div>
      </main>
    );
  }
}
