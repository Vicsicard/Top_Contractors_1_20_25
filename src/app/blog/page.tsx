import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostsByCategory } from '@/utils/supabase-blog';
import { tradesData } from '@/lib/trades-data';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';
import { supabase } from '@/utils/supabase';

interface Props {
    searchParams: { 
        category?: string;
        page?: string;
    };
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

    try {
        // If a category is selected, show posts for that category
        if (category) {
            const { posts, hasNextPage, hasPrevPage } = await getPostsByCategory(category, currentPage, postsPerPage);

            if (posts.length === 0 && currentPage > 1) {
                return notFound();
            }

            // Prepare structured data for category page
            const structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Blog',
                headline: `${tradesData[category]?.title} Blog Posts`,
                description: `Expert ${tradesData[category]?.title.toLowerCase()} tips and advice for Denver homeowners`,
                publisher: {
                    '@type': 'Organization',
                    name: 'Top Contractors Denver',
                    url: 'https://topcontractorsdenver.com'
                },
                url: `https://topcontractorsdenver.com/blog?category=${category}`,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': 'https://topcontractorsdenver.com/blog'
                },
                blogPost: posts.map(post => ({
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt,
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    image: post.feature_image,
                    author: post.authors?.map(author => ({
                        '@type': 'Person',
                        name: author.name
                    })) || [],
                    publisher: {
                        '@type': 'Organization',
                        name: 'Top Contractors Denver',
                        url: 'https://topcontractorsdenver.com'
                    }
                }))
            };

            return (
                <main className="container mx-auto px-4 py-8">
                    <JsonLd data={structuredData} />
                    <div className="mb-8">
                        <Link
                            href="/blog"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            ← Back to All Categories
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold mb-8">
                        {tradesData[category]?.title} Articles
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {post.feature_image && (
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={post.feature_image}
                                                alt={post.feature_image_alt || post.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </Link>
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        {formatDate(post.published_at)}
                                        {post.reading_time && ` • ${post.reading_time} min read`}
                                    </p>
                                    <p className="text-gray-700 mb-4 line-clamp-3">
                                        {post.excerpt || post.title}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center gap-4">
                        {hasPrevPage && (
                            <Link
                                href={`/blog?${new URLSearchParams({
                                    category,
                                    page: (currentPage - 1).toString(),
                                })}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Previous
                            </Link>
                        )}
                        {hasNextPage && (
                            <Link
                                href={`/blog?${new URLSearchParams({
                                    category,
                                    page: (currentPage + 1).toString(),
                                })}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </main>
            );
        }

        // If no category is selected, show trade category cards
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            headline: 'Home Improvement Blog',
            description: 'Expert home improvement tips and advice for Denver homeowners',
            publisher: {
                '@type': 'Organization',
                name: 'Top Contractors Denver',
                url: 'https://topcontractorsdenver.com'
            },
            url: 'https://topcontractorsdenver.com/blog',
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': 'https://topcontractorsdenver.com/blog'
            }
        };

        // Get post counts for each category
        const categoryCounts: Record<string, number> = {};
        for (const [slug] of Object.entries(tradesData)) {
            const { count } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('trade_category', slug);
            categoryCounts[slug] = count || 0;
        }

        return (
            <main className="container mx-auto px-4 py-8">
                <JsonLd data={structuredData} />
                <h1 className="text-4xl font-bold mb-8">Home Improvement Blog</h1>
                <p className="text-xl text-gray-600 mb-12">
                    Expert tips, guides, and advice for all your home improvement projects
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(tradesData).map(([slug, data]) => (
                        categoryCounts[slug] > 0 && (
                            <Link
                                key={slug}
                                href={`/blog?category=${slug}`}
                                className="block group"
                            >
                                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                                    <div className="p-6">
                                        <div className="text-3xl mb-4">{data.icon}</div>
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                            {data.title} Resources
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                            {data.shortDescription}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {categoryCounts[slug]} articles
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        )
                    ))}
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}
