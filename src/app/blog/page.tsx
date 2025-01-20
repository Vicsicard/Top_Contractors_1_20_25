import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getPostsByCategory, GhostPost } from '@/utils/ghost';
import { tradesData } from '@/lib/trades-data';
import { getCategoryIcon } from '@/components/trade-icons';

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
    const currentPage = Number(searchParams.page) || 1;
    const category = searchParams.category;
    
    let posts: GhostPost[] = [];
    let totalPages = 1;
    let hasNextPage = false;
    let hasPrevPage = false;

    try {
        // Get posts based on category filter
        const result = category 
            ? await getPostsByCategory(category, currentPage, 12)
            : await getPosts(currentPage, 12);
            
        posts = result.posts;
        totalPages = result.totalPages;
        hasNextPage = result.hasNextPage;
        hasPrevPage = result.hasPrevPage;
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Don't throw the error, let's handle it gracefully in the UI
    }

    // Get all available categories
    const categories = Object.entries(tradesData).map(([_, data]) => data);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Filter */}
            <div className="mb-12">
                <h2 className="text-lg font-semibold mb-4">Filter by Category:</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link 
                        href="/blog"
                        className="group"
                    >
                        <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${!category ? 'ring-2 ring-blue-600' : ''}`}>
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-3" aria-hidden="true">
                                    📚
                                </span>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    All Posts
                                </h3>
                            </div>
                            <p className="text-gray-600">
                                View all blog posts across categories
                            </p>
                        </div>
                    </Link>
                    {categories
                        .filter(cat => cat.id !== 'carpenter')
                        .map((cat) => {
                            const icons: Record<string, string> = {
                                plumber: "🔧",
                                electrician: "⚡",
                                hvac: "❄️",
                                roofer: "🏠",
                                painter: "🎨",
                                landscaper: "🌳",
                                home_remodeler: "/icons/house.svg",
                                bathroom_remodeler: "/icons/shower.svg",
                                kitchen_remodeler: "/icons/stove.svg",
                                siding_and_gutters: "/icons/house.svg",
                                masonry: "🏠",
                                decks: "🪑",
                                flooring: "🏠",
                                windows: "🪟",
                                fencing: "🚧",
                                epoxy_garage: "🚗"
                            };

                            const descriptions: Record<string, string> = {
                                plumber: "Expert plumbing tips and guides",
                                electrician: "Electrical solutions and safety advice",
                                hvac: "Heating and cooling maintenance tips",
                                roofer: "Roofing insights and maintenance guides",
                                painter: "Professional painting techniques and tips",
                                landscaper: "Professional landscaping and yard care tips",
                                home_remodeler: "Home renovation and remodeling guides",
                                bathroom_remodeler: "Bathroom renovation tips and ideas",
                                kitchen_remodeler: "Kitchen design and remodeling advice",
                                siding_and_gutters: "Siding maintenance and gutter care tips",
                                masonry: "Masonry and stonework guides",
                                decks: "Deck building and maintenance tips",
                                flooring: "Flooring installation and care guides",
                                windows: "Window replacement and maintenance tips",
                                fencing: "Fence installation and repair guides",
                                epoxy_garage: "Garage floor coating tips and guides"
                            };

                            return (
                                <Link
                                    key={cat.id}
                                    href={`/blog?category=${cat.id}`}
                                    className="group"
                                >
                                    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${category === cat.id ? 'ring-2 ring-blue-600' : ''}`}>
                                        <div className="flex items-center mb-4">
                                            {icons[cat.id] && icons[cat.id].startsWith('/') ? (
                                                <div className={`w-12 h-12 mr-3 flex items-center justify-center rounded-lg ${category === cat.id ? 'bg-blue-600' : 'bg-[#e8f0fe]'} transition-colors duration-300 group-hover:bg-blue-600`}>
                                                    <Image
                                                        src={icons[cat.id]}
                                                        alt={cat.title}
                                                        width={32}
                                                        height={32}
                                                        className={`${category === cat.id ? 'text-white' : 'text-blue-600'} group-hover:text-white transition-colors duration-300`}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-3xl mr-3" aria-hidden="true">
                                                    {icons[cat.id] || "📝"}
                                                </span>
                                            )}
                                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {cat.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600">
                                            {descriptions[cat.id] || `${cat.title} tips and guides`}
                                        </p>
                                    </div>
                                </Link>
                            );
                    })}
                </div>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {category ? `No posts found in ${tradesData[category]?.title || 'this category'}` : 'No posts available'}
                    </h3>
                    <p className="text-gray-600">
                        {category ? 'Try selecting a different category or check back later.' : 'Please check back later for new content.'}
                    </p>
                </div>
            ) : (
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
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-12">
                {hasPrevPage && (
                    <Link
                        href={`/blog?${new URLSearchParams({
                            ...(category ? { category } : {}),
                            page: String(currentPage - 1)
                        })}`}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Previous
                    </Link>
                )}
                
                <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(num => {
                            // Show first 4 pages, last page, and current page
                            return num <= 4 || num === totalPages || num === currentPage;
                        })
                        .map((pageNum, index, array) => {
                            // Add ellipsis if there's a gap
                            if (index > 0 && array[index] - array[index - 1] > 1) {
                                return (
                                    <div key={`${pageNum}-group`} className="flex items-center space-x-2">
                                        <span className="px-4 py-2">...</span>
                                        <Link
                                            href={`/blog?${new URLSearchParams({
                                                ...(category ? { category } : {}),
                                                page: String(pageNum)
                                            })}`}
                                            className={`px-4 py-2 rounded-lg ${
                                                currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    </div>
                                );
                            }
                            
                            return (
                                <Link
                                    key={pageNum}
                                    href={`/blog?${new URLSearchParams({
                                        ...(category ? { category } : {}),
                                        page: String(pageNum)
                                    })}`}
                                    className={`px-4 py-2 rounded-lg ${
                                        currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}
                </div>

                {hasNextPage && (
                    <Link
                        href={`/blog?${new URLSearchParams({
                            ...(category ? { category } : {}),
                            page: String(currentPage + 1)
                        })}`}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Next
                    </Link>
                )}
            </div>
        </div>
    );
}
