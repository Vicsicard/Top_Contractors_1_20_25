import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByCategory, getTradeCategories } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';
import { supabase } from '@/utils/supabase';
import { BlogPostCard } from '@/components/BlogPostCard';
import { Post } from '@/types/blog';

interface Props {
    searchParams: { 
        category?: string;
        page?: string;
    };
}

interface BlogCardProps {
    post: Post;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const category = searchParams.category;
    const currentPage = parseInt(searchParams.page || '1');
    
    let title = 'Home Improvement Blog | Top Contractors Denver';
    let description = 'Expert home improvement tips, guides, and advice for Denver homeowners. Find professional insights and practical solutions for your next project.';
    
    if (category && tradesData[category]) {
        const categoryData = tradesData[category];
        title = `${categoryData.title} Tips & Advice | Denver Home Improvement Blog`;
        description = `Expert ${categoryData.title.toLowerCase()} tips, guides, and professional advice for Denver homeowners. Find trusted solutions for your ${categoryData.title.toLowerCase()} projects.`;
    }

    if (currentPage > 1) {
        title = `${title} - Page ${currentPage}`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_US',
            url: `https://topcontractorsdenver.com/blog${category ? `?category=${category}` : ''}${currentPage > 1 ? `&page=${currentPage}` : ''}`,
            siteName: 'Top Contractors Denver',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function BlogPage({ searchParams }: Props) {
    const category = searchParams.category;
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
    const postsPerPage = 10;

    console.log('BlogPage - Starting render with params:', { searchParams, category, currentPage, postsPerPage });

    try {
        // Get all available trade categories from the database
        const availableCategories = await getTradeCategories();
        console.log('BlogPage - Available categories in database:', availableCategories);

        // If a category is selected, show posts for that category
        if (category) {
            // Verify if category exists in tradesData
            if (!tradesData[category]) {
                console.error('BlogPage - Invalid category:', category);
                console.log('BlogPage - Available categories:', Object.keys(tradesData));
                return notFound();
            }

            // Get posts for this category
            console.log('BlogPage - Fetching posts for category:', category);
            const result = await getPostsByCategory(category, currentPage, postsPerPage);
            
            if (!result) {
                throw new Error(`Failed to fetch posts for category: ${category}`);
            }

            // Log the results for debugging
            console.log('BlogPage - Query result:', {
                category,
                postsCount: result.posts.length,
                posts: result.posts.map(p => ({
                    id: p.id,
                    title: p.title,
                    trade_category: p.trade_category,
                    html: p.html ? 'Has HTML content' : 'No HTML content'
                }))
            });

            return (
                <div className="container mx-auto px-4 py-8">
                    {result.posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">
                                No blog posts found for this category yet. Check back soon for updates!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {result.posts.map((post) => (
                                <BlogPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {(result.hasPrevPage || result.hasNextPage) && (
                        <div className="mt-12 flex justify-center gap-4">
                            {result.hasPrevPage && (
                                <Link
                                    href={`/blog?category=${category}&page=${currentPage - 1}`}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    Previous
                                </Link>
                            )}
                            {result.hasNextPage && (
                                <Link
                                    href={`/blog?category=${category}&page=${currentPage + 1}`}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        // If no category is selected, show all categories
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(tradesData).map(([slug, data]) => (
                        <Link
                            key={slug}
                            href={`/blog?category=${slug}`}
                            className="block p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {data.title} Articles
                            </h2>
                            <p className="text-gray-600">
                                {data.shortDescription}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('BlogPage - Error:', error);
        // Convert any error to a proper Error object with a message
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(
                typeof error === 'string' 
                    ? error 
                    : 'An unexpected error occurred while loading the blog page'
            );
        }
    }
}
