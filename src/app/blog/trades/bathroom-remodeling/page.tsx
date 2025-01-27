import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/date';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';

interface Props {
    searchParams: {
        page?: string;
    };
}

const trade = 'bathroom-remodeling';

export async function generateMetadata(): Promise<Metadata> {
    const tradeData = tradesData[trade];

    if (!tradeData) {
        return {
            title: 'Trade Not Found | Top Contractors Denver Blog',
            description: 'The requested trade page could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${tradeData.title} Blog | Top Contractors Denver`,
        description: `Read expert articles about ${tradeData.title.toLowerCase()} on Top Contractors Denver Blog`,
        openGraph: {
            title: `${tradeData.title} Blog | Top Contractors Denver`,
            description: `Read expert articles about ${tradeData.title.toLowerCase()} on Top Contractors Denver Blog`,
            type: 'website',
        },
        alternates: {
            canonical: `/blog/trades/${trade}`
        }
    };
}

export default async function TradeBlogPage({ searchParams }: Props) {
    const tradeData = tradesData[trade];
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    if (!tradeData) {
        notFound();
    }

    const { posts, totalPages, hasNextPage, hasPrevPage } = await getPostsByCategory(trade, page);

    if (!posts || posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">{tradeData.title} Blog</h1>
                <p className="text-gray-600 mb-8">
                    No posts found. Please check back soon for new content about {tradeData.title.toLowerCase()}.
                </p>
                <Link
                    href="/blog"
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back to Blog
                </Link>
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${tradeData.title} Blog | Top Contractors Denver`,
        description: `Read expert articles about ${tradeData.title.toLowerCase()} on Top Contractors Denver Blog`,
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
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        {tradeData.icon && (
                            <Image
                                src={tradeData.icon}
                                alt={`${tradeData.title} icon`}
                                width={48}
                                height={48}
                                className="w-12 h-12"
                            />
                        )}
                        <h1 className="text-4xl font-bold">{tradeData.title} Blog</h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Read expert articles about {tradeData.title.toLowerCase()} and related topics.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {post.feature_image && (
                                <Link href={`/blog/${post.slug}`} className="block aspect-video relative overflow-hidden">
                                    <Image
                                        src={post.feature_image}
                                        alt={post.feature_image_alt || post.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
