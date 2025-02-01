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
            console.error('Missing required parameters:', params);
            throw new Error('Missing required parameters');
        }

        // Fetch post with retries
        let post: Post | null = null;
        let retries = 3;
        
        while (retries > 0) {
            try {
                post = await getPostBySlug(params.slug, params.category);
                if (post) break; // Exit loop if post is found
                
                console.log('Post not found, retrying...', { 
                    slug: params.slug, 
                    category: params.category,
                    retriesLeft: retries - 1 
                });
                retries--;
                if (retries === 0) {
                    notFound();
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error fetching post:', error);
                retries--;
                if (retries === 0) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // At this point, post is guaranteed to be non-null because notFound() would have been called
        const postData = post as Post;

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
