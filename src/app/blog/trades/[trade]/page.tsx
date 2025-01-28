import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';

// Helper function to validate image URL
function isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        // Log the URL being validated
        console.log('Validating image URL:', {
            url,
            protocol: urlObj.protocol,
            hostname: urlObj.hostname
        });
        // Accept any https URL from bubble.io CDN
        if (urlObj.hostname.includes('bubble.io')) {
            return true;
        }
        // For other URLs, require http/https protocol
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        console.error('URL validation error:', error);
        // Allow relative URLs starting with /
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
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    if (!tradeData) {
        notFound();
    }

    const { posts, hasNextPage, hasPrevPage } = await getPostsByCategory(trade, page);

    if (!posts || posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">{tradeData.title} Blog</h1>
                <p className="text-gray-600">No blog posts found for this trade category.</p>
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${tradeData.title} Blog | Top Contractors Denver`,
        description: `Read expert ${tradeData.title.toLowerCase()} tips, guides, and advice. Professional insights for Denver homeowners.`,
        url: `/blog/trades/${trade}`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'BlogPosting',
                    headline: post.title,
                    url: `/blog/${post.slug}`,
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    author: post.authors?.[0] ? {
                        '@type': 'Person',
                        name: post.authors[0].name
                    } : undefined,
                    image: post.feature_image || undefined
                }
            }))
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">{tradeData.title} Blog</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {post.feature_image && isValidImageUrl(post.feature_image) && (
                                <Link href={`/blog/${post.slug}`} className="block aspect-video relative overflow-hidden">
                                    <Image
                                        src={post.feature_image}
                                        alt={post.feature_image_alt || post.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        onError={(e) => {
                                            console.error('Image loading error:', {
                                                src: post.feature_image,
                                                error: e
                                            });
                                        }}
                                    />
                                </Link>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {formatDate(post.published_at)}
                                </p>
                                {post.excerpt && (
                                    <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
                                )}
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {(hasNextPage || hasPrevPage) && (
                    <div className="mt-8 flex justify-center gap-4">
                        {hasPrevPage && (
                            <Link
                                href={`/blog/trades/${trade}?page=${page - 1}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                ← Previous
                            </Link>
                        )}
                        {hasNextPage && (
                            <Link
                                href={`/blog/trades/${trade}?page=${page + 1}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Next →
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
