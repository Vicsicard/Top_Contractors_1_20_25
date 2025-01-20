import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostsByTag, GhostPost } from '@/utils/ghost';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';

interface Props {
    params: {
        tag: string;
    };
    searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const tag = decodeURIComponent(params.tag);
    return {
        title: `${tag} Posts | Top Contractors Denver Blog`,
        description: `Read all our blog posts about ${tag.toLowerCase()} and related topics.`,
    };
}

export default async function TagPage({ params, searchParams }: Props) {
    const tag = decodeURIComponent(params.tag);
    const currentPage = parseInt(searchParams.page || '1');
    const { posts, totalPages } = await getPostsByTag(tag, currentPage);

    // Generate schema for the tag page
    const tagPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${tag} Posts`,
        description: `Blog posts about ${tag.toLowerCase()} and related topics`,
        publisher: {
            '@type': 'Organization',
            name: 'Top Contractors Denver',
            logo: {
                '@type': 'ImageObject',
                url: 'https://topcontractorsdenver.com/images/logo.png'
            }
        },
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt || post.title,
                    url: `https://topcontractorsdenver.com/blog/${post.slug}`,
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    author: post.authors?.map(author => ({
                        '@type': 'Person',
                        name: author.name
                    })) || []
                }
            }))
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <JsonLd data={tagPageSchema} />
            
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Posts tagged with "{tag}"</h1>
                <p className="text-gray-600">Browse all our blog posts about {tag.toLowerCase()} and related topics.</p>
            </header>

            <div className="space-y-8">
                {posts.map(post => (
                    <article key={post.id} className="border-b border-gray-200 pb-8">
                        <Link href={`/blog/${post.slug}`} className="group">
                            {post.feature_image && (
                                <div className="relative aspect-video mb-4">
                                    <Image
                                        src={post.feature_image}
                                        alt={post.feature_image_alt || post.title}
                                        fill
                                        className="object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                    />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                        </Link>

                        {post.excerpt && (
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        )}

                        <div className="flex items-center text-sm text-gray-500">
                            {post.authors?.[0] && (
                                <div className="flex items-center mr-6">
                                    {post.authors[0].profile_image && (
                                        <Image
                                            src={post.authors[0].profile_image}
                                            alt={post.authors[0].name}
                                            width={24}
                                            height={24}
                                            className="rounded-full mr-2"
                                        />
                                    )}
                                    <span>{post.authors[0].name}</span>
                                </div>
                            )}
                            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                            {post.reading_time && (
                                <span className="ml-6">{post.reading_time} min read</span>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-4 mt-8">
                    {currentPage > 1 && (
                        <Link
                            href={`/blog/tag/${params.tag}?page=${currentPage - 1}`}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    {currentPage < totalPages && (
                        <Link
                            href={`/blog/tag/${params.tag}?page=${currentPage + 1}`}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
