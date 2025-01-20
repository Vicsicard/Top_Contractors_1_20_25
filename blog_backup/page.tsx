import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getPostsByCategory, GhostPost } from '@/utils/ghost';
import { tradesData } from '@/lib/trades-data';

interface Props {
    searchParams: { 
        category?: string;
        page?: string;
    };
}

export const metadata: Metadata = {
    title: 'Blog | Top Contractors Denver',
    description: 'Expert home improvement tips, guides, and advice for Denver homeowners. Find professional insights and practical solutions.',
};

export default async function BlogPage({ searchParams }: Props) {
    const currentPage = parseInt(searchParams.page || '1');
    const category = searchParams.category;
    
    // Get posts based on category filter
    const postsResponse = category 
        ? await getPostsByCategory(category, currentPage)
        : await getAllPosts();

    const { posts, totalPages, hasNextPage, hasPrevPage } = 'posts' in postsResponse 
        ? postsResponse 
        : { posts: postsResponse, totalPages: 1, hasNextPage: false, hasPrevPage: false };

    // Get all available categories
    const categories = Object.entries(tradesData).map(([tradeId, data]) => ({
        tradeId,
        ...data
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Filter */}
            <div className="mb-12">
                <h2 className="text-lg font-semibold mb-4">Filter by Category:</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Link 
                        href="/blog"
                        className={`p-2 text-center border rounded-lg ${!category ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                    >
                        All Posts
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.tradeId}
                            href={`/blog?category=${cat.tradeId}`}
                            className={`p-2 text-center border rounded-lg ${category === cat.tradeId ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-12 flex justify-center">
                    <ul className="flex space-x-2">
                        {hasPrevPage && (
                            <li>
                                <Link
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                    href={`/blog?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
                                >
                                    Previous
                                </Link>
                            </li>
                        )}
                        {hasNextPage && (
                            <li>
                                <Link
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                    href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
                                >
                                    Next
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </div>
    );
}
