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
    
    let posts: GhostPost[] = [];
    let totalPages = 1;
    let hasNextPage = false;
    let hasPrevPage = false;

    try {
        // Get all posts without category filtering
        const result = await getPosts(currentPage, 12);
            
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
        headline: 'Home Improvement Blog',
        description: 'Expert home improvement tips and advice for Denver homeowners',
        publisher: {
            '@type': 'Organization',
            name: 'Top Contractors Denver',
            url: 'https://topcontractorsdenver.com'
        },
        url: `https://topcontractorsdenver.com/blog${currentPage > 1 ? `?page=${currentPage}` : ''}`,
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
                {/* Category Navigation */}
                <nav aria-label="Blog categories" className="mb-12">
                    <h2 className="text-lg font-semibold mb-4">Browse by Category:</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(tradesData).map(([id, data]) => (
                            <Link
                                key={id}
                                href={`/blog/trades/${id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center mb-4">
                                        {data.icon && data.icon.startsWith('/') ? (
                                            <div className="w-12 h-12 mr-3 flex items-center justify-center rounded-lg bg-[#e8f0fe] transition-colors duration-300 group-hover:bg-blue-600">
                                                <Image
                                                    src={data.icon}
                                                    alt={data.title}
                                                    width={24}
                                                    height={24}
                                                    className="text-blue-600 group-hover:brightness-0 group-hover:invert transition-all duration-300"
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
                                    <p className="text-gray-600 line-clamp-2">{data.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Posts Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h2>
                </div>
                
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No posts available
                        </h3>
                        <p className="text-gray-600">
                            Please check back later for new content.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {post.feature_image && (
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={post.feature_image}
                                                alt={post.feature_image_alt || post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div className="p-6">
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.excerpt || post.title}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <time dateTime={post.published_at}>
                                            {formatDate(post.published_at)}
                                        </time>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Read More →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {hasPrevPage && (
                            <Link
                                href={`/blog?page=${currentPage - 1}`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Previous
                            </Link>
                        )}
                        {hasNextPage && (
                            <Link
                                href={`/blog?page=${currentPage + 1}`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
