import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostsByTag, GhostPost } from '@/utils/ghost';

interface Props {
    params: {
        tag: string;
    };
    searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const tag = decodeURIComponent(params.tag);
    return {
        title: `${tag} Posts | Contractor Blog`,
        description: `Read all our blog posts about ${tag.toLowerCase()} and related topics.`,
    };
}

export default async function TagPage({ params, searchParams }: Props) {
    const tag = decodeURIComponent(params.tag);
    const currentPage = Number(searchParams.page) || 1;
    const { posts, totalPages, hasNextPage, hasPrevPage } = await getPostsByTag(tag, currentPage);

    if (!posts.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Posts tagged with &ldquo;{tag}&rdquo;
                </h1>
                <p className="text-lg text-gray-600">
                    No posts found with this tag.
                </p>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                    ← Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Posts tagged with &ldquo;{tag}&rdquo;
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post: GhostPost) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                        <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {post.feature_image && (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={post.feature_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                    {post.title}
                                </h2>
                                {post.excerpt && (
                                    <p className="text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>
                                )}
                                <div className="flex items-center text-sm text-gray-500">
                                    <time dateTime={post.published_at}>
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </time>
                                    <span className="mx-2">•</span>
                                    <span>{post.reading_time} min read</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                    {hasPrevPage && (
                        <Link
                            href={`/blog/tag/${params.tag}?page=${currentPage - 1}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Previous
                        </Link>
                    )}
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <Link
                                key={pageNum}
                                href={`/blog/tag/${params.tag}?page=${pageNum}`}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    pageNum === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </Link>
                        ))}
                    </div>

                    {hasNextPage && (
                        <Link
                            href={`/blog/tag/${params.tag}?page=${currentPage + 1}`}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
