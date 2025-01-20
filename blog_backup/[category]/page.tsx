import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostsByCategory, GhostPost } from '@/utils/ghost';
import { tradesData } from '@/lib/trades-data';

interface Props {
    params: {
        category: string;
    };
    searchParams: { 
        page?: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = tradesData[params.category];
    
    if (!category) {
        return {
            title: 'Category Not Found',
            description: 'The requested category could not be found.'
        };
    }

    return {
        title: `${category.title} Tips & Guides | Top Contractors Denver Blog`,
        description: `Expert ${category.title.toLowerCase()} tips, guides, and advice for Denver homeowners. Find professional insights and practical solutions.`,
        keywords: `${category.title.toLowerCase()}, Denver ${category.title.toLowerCase()}, ${category.title.toLowerCase()} tips, ${category.title.toLowerCase()} guides, home improvement`,
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const category = tradesData[params.category];
    
    if (!category) {
        notFound();
    }

    const currentPage = Number(searchParams.page) || 1;
    const { posts, totalPages, hasNextPage, hasPrevPage } = await getPostsByCategory(params.category, currentPage);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="mb-8">
                <ol className="flex space-x-2 text-sm text-gray-500">
                    <li>
                        <Link href="/blog" className="hover:text-blue-600">
                            Blog
                        </Link>
                    </li>
                    <li>&gt;</li>
                    <li className="text-gray-900">{category.title}</li>
                </ol>
            </nav>

            {/* Category Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {category.title} Tips & Guides
                </h1>
                <p className="text-lg text-gray-600">
                    Expert advice and practical guides for {category.title.toLowerCase()} projects in Denver.
                    Find professional insights, cost guides, and maintenance tips from our network of verified {category.title.toLowerCase()} contractors.
                </p>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">
                        No posts available in this category yet.
                    </p>
                    <p className="text-gray-500">
                        In the meantime, explore our{' '}
                        <Link href={`/trades/${category.id}`} className="text-blue-600 hover:underline">
                            {category.title} services
                        </Link>
                        {' '}or check our{' '}
                        <Link href="/blog" className="text-blue-600 hover:underline">
                            other blog posts
                        </Link>.
                    </p>
                </div>
            ) : (
                <>
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
                                        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center space-x-4">
                            {hasPrevPage && (
                                <Link
                                    href={`/blog/${category.id}?page=${currentPage - 1}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            {hasNextPage && (
                                <Link
                                    href={`/blog/${category.id}?page=${currentPage + 1}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
