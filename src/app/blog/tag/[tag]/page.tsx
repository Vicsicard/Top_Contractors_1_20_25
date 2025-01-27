import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByTag } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';

interface Props {
    params: {
        tag: string;
    };
    searchParams: {
        page?: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const tag = decodeURIComponent(params.tag);
    const { posts } = await getPostsByTag(tag, 1, 1);

    if (!posts || posts.length === 0) {
        return {
            title: 'Tag Not Found | Top Contractors Denver Blog',
            description: 'The requested tag page could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${tag} Articles | Top Contractors Denver Blog`,
        description: `Read expert articles about ${tag} on Top Contractors Denver Blog`,
        openGraph: {
            title: `${tag} Articles | Top Contractors Denver Blog`,
            description: `Read expert articles about ${tag} on Top Contractors Denver Blog`,
            type: 'website',
        },
        alternates: {
            canonical: `/blog/tag/${params.tag}`
        }
    };
}

export default async function TagPage({ params, searchParams }: Props) {
    const tag = decodeURIComponent(params.tag);
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const { posts, hasNextPage, hasPrevPage } = await getPostsByTag(tag, page);

    if (!posts || posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Tag Not Found</h1>
                <p className="text-gray-600">No posts found with this tag.</p>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    ← Back to Blog
                </Link>
            </div>
        );
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${tag} Articles | Top Contractors Denver Blog`,
        description: `Read expert articles about ${tag} on Top Contractors Denver Blog`,
        url: `/blog/tag/${params.tag}`,
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
                <h1 className="text-4xl font-bold mb-8">{tag} Articles</h1>
                
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
                                href={`/blog/tag/${params.tag}?page=${page - 1}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                ← Previous
                            </Link>
                        )}
                        {hasNextPage && (
                            <Link
                                href={`/blog/tag/${params.tag}?page=${page + 1}`}
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
