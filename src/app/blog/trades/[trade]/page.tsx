import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPosts, getPostsByCategory, GhostPost, PaginatedPosts } from '@/utils/ghost';
import { tradesData, Trade } from '@/lib/trades-data';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';

// Helper function to validate image URL
function isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return url.startsWith('/');
    }
}

interface Props {
    params: {
        trade: string;
    };
    searchParams: {
        page?: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const trade = params.trade;
    const tradeData = tradesData[trade];

    if (!tradeData) {
        return {
            title: 'Trade Not Found | Top Contractors Denver Blog',
            description: 'The requested trade blog page could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${tradeData.title} Blog | Top Contractors Denver`,
        description: `Read expert ${tradeData.title.toLowerCase()} tips, guides, and advice. Professional insights for Denver homeowners.`,
        openGraph: {
            title: `${tradeData.title} Blog | Top Contractors Denver`,
            description: `Read expert ${tradeData.title.toLowerCase()} tips, guides, and advice. Professional insights for Denver homeowners.`,
            type: 'website',
        },
        alternates: {
            canonical: `/blog/trades/${trade}`
        }
    };
}

export default async function TradeBlogPage({ params, searchParams }: Props) {
    const trade = params.trade;
    const tradeData = tradesData[trade];
    const currentPage = parseInt(searchParams.page || '1');

    if (!tradeData) {
        notFound();
    }

    const posts = await getPostsByCategory(trade, currentPage);
    const { posts: blogPosts, totalPages, currentPage: page, hasNextPage, hasPrevPage } = posts;

    // Show empty state if no posts
    if (blogPosts.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{tradeData.title} Blog</h1>
                    <p className="text-xl text-gray-600 mb-8">No posts found for this category yet. Check back soon!</p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        ← Back to All Posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Trade Header */}
            <div className="mb-12 text-center">
                <div className="flex items-center justify-center mb-4">
                    {tradeData.icon && isValidImageUrl(tradeData.icon) && (
                        <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-blue-600 mb-4">
                            <Image
                                src={tradeData.icon}
                                alt={`${tradeData.title} icon`}
                                width={32}
                                height={32}
                                className="text-white"
                            />
                        </div>
                    )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{tradeData.title} Blog</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{tradeData.description}</p>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {post.feature_image && isValidImageUrl(post.feature_image) && (
                            <Link href={`/blog/trades/${trade}/${post.slug}`}>
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
                            <Link href={`/blog/trades/${trade}/${post.slug}`}>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.excerpt || post.title}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <time dateTime={post.published_at}>
                                    {formatDate(post.published_at)}
                                </time>
                                <Link
                                    href={`/blog/trades/${trade}/${post.slug}`}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                    {hasPrevPage && (
                        <Link
                            href={`/blog/trades/${trade}?page=${page - 1}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Previous
                        </Link>
                    )}
                    {hasNextPage && (
                        <Link
                            href={`/blog/trades/${trade}?page=${page + 1}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}

            {/* Structured Data */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "name": `${tradeData.title} Blog | Top Contractors Denver`,
                    "description": `Read expert ${tradeData.title.toLowerCase()} tips, guides, and advice. Professional insights for Denver homeowners.`,
                    "url": `https://topcontractorsdenver.com/blog/trades/${trade}`,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Top Contractors Denver",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://topcontractorsdenver.com/logo.png"
                        }
                    }
                }}
            />
        </div>
    );
}
