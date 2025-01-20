import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getPostsByCategory, GhostPost } from '@/utils/ghost';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';

interface Props {
    searchParams: { 
        category?: string;
        page?: string;
    };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const category = searchParams.category;
    const currentPage = parseInt(searchParams.page || '1');
    
    let title = 'Home Improvement Blog | Top Contractors Denver';
    let description = 'Expert home improvement tips, guides, and advice for Denver homeowners. Find professional insights and practical solutions for your next project.';
    
    if (category && tradesData[category]) {
        const categoryData = tradesData[category];
        title = `${categoryData.title} Tips & Advice | Denver Home Improvement Blog`;
        description = `Expert ${categoryData.title.toLowerCase()} tips, guides, and professional advice for Denver homeowners. Find trusted solutions for your ${categoryData.title.toLowerCase()} projects.`;
    }

    if (currentPage > 1) {
        title = `${title} - Page ${currentPage}`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_US',
            url: `https://topcontractorsdenver.com/blog${category ? `?category=${category}` : ''}${currentPage > 1 ? `&page=${currentPage}` : ''}`,
            siteName: 'Top Contractors Denver',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function BlogPage({ searchParams }: Props) {
    const currentPage = parseInt(searchParams.page || '1');
    const category = searchParams.category;
    
    let posts: GhostPost[] = [];
    let totalPages = 1;
    let hasNextPage = false;
    let hasPrevPage = false;

    try {
        // Get posts based on category filter
        const result = category 
            ? await getPostsByCategory(category, currentPage, 12)
            : await getPosts(currentPage, 12);
            
        posts = result.posts;
        totalPages = result.totalPages;
        hasNextPage = result.hasNextPage;
        hasPrevPage = result.hasPrevPage;
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Don't throw the error, let's handle it gracefully in the UI
    }

    // Prepare structured data
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        headline: category && tradesData[category] 
            ? `${tradesData[category].title} Tips & Advice`
            : 'Home Improvement Blog',
        description: category && tradesData[category]
            ? `Expert ${tradesData[category].title.toLowerCase()} tips and advice for Denver homeowners`
            : 'Expert home improvement tips and advice for Denver homeowners',
        publisher: {
            '@type': 'Organization',
            name: 'Top Contractors Denver',
            url: 'https://topcontractorsdenver.com'
        },
        url: `https://topcontractorsdenver.com/blog${category ? `?category=${category}` : ''}${currentPage > 1 ? `&page=${currentPage}` : ''}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://topcontractorsdenver.com/blog'
        },
        blogPost: posts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            image: post.feature_image,
            author: post.authors?.map(author => ({
                '@type': 'Person',
                name: author.name
            })) || [],
            publisher: {
                '@type': 'Organization',
                name: 'Top Contractors Denver',
                url: 'https://topcontractorsdenver.com'
            }
        }))
    };

    return (
        <>
            <JsonLd data={structuredData} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter */}
                <nav aria-label="Blog categories" className="mb-12">
                    <h2 className="text-lg font-semibold mb-4">Filter by Category:</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link 
                            href="/blog"
                            className="group"
                        >
                            <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${!category ? 'ring-2 ring-blue-600' : ''}`}>
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3" aria-hidden="true">
                                        📚
                                    </span>
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        All Posts
                                    </h3>
                                </div>
                                <p className="text-gray-600">
                                    View all blog posts across categories
                                </p>
                            </div>
                        </Link>
                        {Object.entries(tradesData).map(([id, data]) => (
                            <Link
                                key={id}
                                href={`/blog?category=${id}`}
                                className="group"
                            >
                                <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${category === id ? 'ring-2 ring-blue-600' : ''}`}>
                                    <div className="flex items-center mb-4">
                                        {data.icon && data.icon.startsWith('/') ? (
                                            <div className={`w-12 h-12 mr-3 flex items-center justify-center rounded-lg ${category === id ? 'bg-blue-600' : 'bg-[#e8f0fe]'} transition-colors duration-300 group-hover:bg-blue-600`}>
                                                <Image
                                                    src={data.icon}
                                                    alt={data.title}
                                                    width={24}
                                                    height={24}
                                                    className={`${category === id ? 'brightness-0 invert' : 'text-blue-600'} group-hover:brightness-0 group-hover:invert transition-all duration-300`}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-3xl mr-3" aria-hidden="true">
                                                {data.icon || "📝"}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {data.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {data.description || `${data.title} tips and guides`}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {category ? `No posts found in ${tradesData[category]?.title || 'this category'}` : 'No posts available'}
                        </h3>
                        <p className="text-gray-600">
                            {category ? 'Try selecting a different category or check back later.' : 'Please check back later for new content.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {post.feature_image && (
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={post.feature_image}
                                                alt={post.title || ''}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-4 mt-12">
                    {hasPrevPage && (
                        <Link
                            href={`/blog?${new URLSearchParams({
                                ...(category ? { category } : {}),
                                page: String(currentPage - 1)
                            })}`}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Previous
                        </Link>
                    )}
                    
                    <div className="flex items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(num => {
                                // Show first 4 pages, last page, and current page
                                return num <= 4 || num === totalPages || num === currentPage;
                            })
                            .map((pageNum, index, array) => {
                                // Add ellipsis if there's a gap
                                if (index > 0 && array[index] - array[index - 1] > 1) {
                                    return (
                                        <div key={`${pageNum}-group`} className="flex items-center space-x-2">
                                            <span className="px-4 py-2">...</span>
                                            <Link
                                                href={`/blog?${new URLSearchParams({
                                                    ...(category ? { category } : {}),
                                                    page: String(pageNum)
                                                })}`}
                                                className={`px-4 py-2 rounded-lg ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <Link
                                        key={pageNum}
                                        href={`/blog?${new URLSearchParams({
                                            ...(category ? { category } : {}),
                                            page: String(pageNum)
                                        })}`}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                    </div>

                    {hasNextPage && (
                        <Link
                            href={`/blog?${new URLSearchParams({
                                ...(category ? { category } : {}),
                                page: String(currentPage + 1)
                            })}`}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Next
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
