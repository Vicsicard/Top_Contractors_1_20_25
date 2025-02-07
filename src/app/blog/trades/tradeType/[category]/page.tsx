import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/date';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';
import { Author, Tag } from '@/types/blog';
import { processHtml } from '@/utils/html-processor';
import { BlogContentErrorBoundary } from '@/components/BlogContentErrorBoundary';
import { Suspense } from 'react';

interface Props {
    params: {
        trade: string;
        category: string;
    };
}

// Helper function to validate image URL
function isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return url.startsWith('/');
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.category, params.trade);
    const trade = tradesData[params.trade];

    if (!post || !trade) {
        return {
            title: 'Post Not Found | Top Contractors Denver Blog',
            description: 'The requested blog post could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${post.title} | ${trade.title} Blog`,
        description: post.excerpt || `Read about ${trade.title.toLowerCase()} on Top Contractors Denver Blog`,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: 'article',
            publishedTime: post.published_at,
            modifiedTime: post.updated_at || undefined,
            authors: post.authors?.map((author: Author) => author.name) || undefined,
            images: post.feature_image ? [post.feature_image] : undefined,
        },
        alternates: {
            canonical: `/blog/trades/${params.trade}/${post.slug}`
        }
    };
}

function BlogContent({ html }: { html: string }) {
    return (
        <div 
            className="prose prose-lg max-w-none
                prose-headings:font-bold
                prose-h1:text-3xl
                prose-h2:text-2xl
                prose-h3:text-xl
                prose-p:text-gray-600
                prose-a:text-blue-600 hover:prose-a:text-blue-800
                prose-strong:text-gray-900
                prose-ul:list-disc
                prose-ol:list-decimal
                prose-li:text-gray-600
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function BlogImages() {
    // Convert Next.js Image wrappers back to actual images
    const replaceImageWrappers = () => {
        if (typeof document === 'undefined') return;
        
        const wrappers = document.querySelectorAll('.next-image-wrapper');
        wrappers.forEach(wrapper => {
            const src = wrapper.getAttribute('data-image-src');
            const alt = wrapper.getAttribute('data-image-alt');
            
            if (src && isValidImageUrl(src)) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'relative aspect-video mb-4';
                
                const img = document.createElement('img');
                img.src = src;
                img.alt = alt || '';
                img.className = 'object-cover';
                
                imgContainer.appendChild(img);
                wrapper.replaceWith(imgContainer);
            }
        });
    };

    useEffect(() => {
        replaceImageWrappers();
    }, []);

    return null;
}

export default async function TradeBlogPost({ params }: Props) {
    const post = await getPostBySlug(params.category, params.trade);
    const trade = tradesData[params.trade];

    if (!post || !trade) {
        notFound();
    }

    // Process HTML content
    const processedHtml = await processHtml(post.html || '');

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-blue-900 text-white">
                <div className="absolute inset-0">
                    {post.feature_image && (
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90" />
                </div>
                <div className="relative container mx-auto px-4 py-16 sm:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">{post.title}</h1>
                        {post.excerpt && (
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">{post.excerpt}</p>
                        )}
                        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-blue-100">
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                            {post.reading_time && (
                                <>
                                    <span>•</span>
                                    <span>{post.reading_time} min read</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <BlogContentErrorBoundary>
                        <Suspense fallback={<div>Loading...</div>}>
                            <BlogContent html={processedHtml} />
                            <BlogImages />
                        </Suspense>
                    </BlogContentErrorBoundary>

                    {/* Author Section */}
                    {post.authors?.[0] && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-bold mb-4">About the Author</h2>
                            <div className="flex items-center">
                                {post.authors[0].profile_image && (
                                    <Image
                                        src={post.authors[0].profile_image}
                                        alt={post.authors[0].name}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                    />
                                )}
                                <div className="ml-4">
                                    <h3 className="font-bold">{post.authors[0].name}</h3>
                                    {post.authors[0].bio && (
                                        <p className="text-gray-600">{post.authors[0].bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags Section */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-8">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: Tag) => (
                                    <Link
                                        key={tag.slug}
                                        href={`/blog/tag/${tag.slug}`}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* JSON-LD */}
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt,
                    image: post.feature_image,
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    author: post.authors?.[0] ? {
                        '@type': 'Person',
                        name: post.authors[0].name,
                        url: post.authors[0].url
                    } : undefined,
                    publisher: {
                        '@type': 'Organization',
                        name: 'Top Contractors Denver',
                        logo: {
                            '@type': 'ImageObject',
                            url: 'https://topcontractorsdenver.com/logo.png'
                        }
                    }
                }}
            />
        </article>
    );
}
