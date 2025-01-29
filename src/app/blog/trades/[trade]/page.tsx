import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';
import { BlogPostCard } from '@/components/BlogPostCard';

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

    const { posts, totalPages, hasNextPage, hasPrevPage, totalPosts } = await getPostsByCategory(trade, page);

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
                    url: `/blog/trades/${trade}/${post.slug}`,
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    author: post.authors && post.authors[0] ? {
                        '@type': 'Person',
                        name: post.authors[0].name
                    } : {
                        '@type': 'Organization',
                        name: 'Top Contractors Denver'
                    },
                    image: post.feature_image || undefined
                }
            }))
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{tradeData.title} Blog</h1>
                    <p className="text-gray-600">
                        Expert tips and advice about {tradeData.title.toLowerCase()} for Denver homeowners
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        {totalPosts} articles in this category
                    </p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.map(post => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>

                {(hasNextPage || hasPrevPage) && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="text-gray-600">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex justify-center gap-4">
                            {hasPrevPage && (
                                <Link
                                    href={`/blog/trades/${trade}?page=${page - 1}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    ← Previous
                                </Link>
                            )}
                            {hasNextPage && (
                                <Link
                                    href={`/blog/trades/${trade}?page=${page + 1}`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
