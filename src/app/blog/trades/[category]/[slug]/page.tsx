import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/supabase-blog';
import { JsonLd } from '@/components/json-ld';
import { processHtml, sanitizeHtml } from '@/utils/html-processor';
import { BlogPostErrorBoundary } from '@/components/BlogPostErrorBoundary';
import Image from 'next/image';
import type { Post } from '@/types/blog';

interface Props {
    params: {
        slug: string;
        category: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    console.log('DEBUG: Generating metadata for:', params);
    const post = await getPostBySlug(params.slug, params.category);

    if (!post) {
        return {
            title: 'Post Not Found | Top Contractors Denver Blog',
            description: 'The requested blog post could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${post.title} | Top Contractors Denver Blog`,
        description: post.excerpt || `Read ${post.title} on Top Contractors Denver Blog`,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: 'article',
            publishedTime: post.published_at,
            modifiedTime: post.updated_at || undefined,
            images: post.feature_image ? [post.feature_image] : undefined,
        },
        alternates: {
            canonical: `/blog/trades/${params.category}/${post.slug}`
        }
    };
}

export default async function BlogPost({ params }: Props) {
    try {
        // Validate parameters
        if (!params.slug || !params.category) {
            console.error('Invalid URL parameters:', params);
            throw new Error('Invalid URL parameters');
        }

        // Single attempt to fetch post with proper error handling
        let postData: Post;
        try {
            const post = await getPostBySlug(params.slug, params.category);
            if (!post) {
                console.log('Post not found:', {
                    slug: params.slug,
                    category: params.category,
                    timestamp: new Date().toISOString()
                });
                notFound();
            }
            postData = post as Post;
        } catch (error) {
            console.error('Error fetching post:', {
                error,
                params,
                timestamp: new Date().toISOString()
            });
            
            if (error instanceof Error) {
                if (error.message === 'Post not found') {
                    notFound();
                }
                throw new Error('Failed to load blog post');
            }
            throw error;
        }

        // Process HTML with error handling
        let processedHtml: string;
        try {
            const processed = processHtml(postData.html);
            if (!processed) {
                throw new Error('Failed to process blog post content');
            }
            processedHtml = processed;
        } catch (error) {
            console.error('Error processing HTML:', error);
            // Fallback to sanitized but unprocessed HTML
            processedHtml = postData.html ? sanitizeHtml(postData.html) : '<p>Error processing content</p>';
        }

        // Prepare JSON-LD data
        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            description: postData.excerpt || undefined,
            image: postData.feature_image || undefined,
            datePublished: postData.published_at,
            dateModified: postData.updated_at || postData.published_at,
            author: {
                '@type': 'Organization',
                name: 'Top Contractors Denver'
            },
            publisher: {
                '@type': 'Organization',
                name: 'Top Contractors Denver',
                logo: {
                    '@type': 'ImageObject',
                    url: '/images/logo.png'
                }
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `/blog/trades/${params.category}/${postData.slug}`
            }
        };

        // Return optimized component
        return (
            <>
                <JsonLd data={jsonLd} />
                <article className="container mx-auto px-4 py-8 max-w-4xl">
                    <header className="mb-8">
                        {postData.feature_image && (
                            <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                                <Image
                                    src={postData.feature_image}
                                    alt={postData.feature_image_alt || postData.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/images/denver-skyline.jpg";
                                    }}
                                />
                            </div>
                        )}
                        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                            <time dateTime={postData.published_at}>
                                {new Date(postData.published_at).toLocaleDateString()}
                            </time>
                            {postData.reading_time && (
                                <>
                                    <span>·</span>
                                    <span>{postData.reading_time} min read</span>
                                </>
                            )}
                        </div>
                    </header>
                    <div 
                        className="blog-content prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: processedHtml }} 
                    />
                </article>
            </>
        );
    } catch (error) {
        console.error('Error in BlogPost page:', error);
        // Enhanced error handling with user-friendly messages
        if (error instanceof Error) {
            if (error.message.includes('Missing required parameters')) {
                throw new Error('Unable to load blog post: Invalid URL parameters');
            } else if (error.message.includes('Failed to process')) {
                throw new Error('Unable to display blog post content. Please try refreshing the page.');
            }
        }
        throw new Error('An error occurred while loading the blog post. Please try again later.');
    }
}
