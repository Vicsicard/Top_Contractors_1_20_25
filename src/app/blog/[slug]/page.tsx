import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/date';
import { getPostBySlug } from '@/utils/supabase-blog';
import { JsonLd } from '@/components/json-ld';
import { processHtml } from '@/utils/html-processor';
import { BlogContentErrorBoundary } from '@/components/BlogContentErrorBoundary';
import { Suspense } from 'react';

interface Props {
    params: {
        slug: string;
    };
}

// Helper function to validate image URL
function isValidImageUrl(url: string | undefined): boolean {
    if (!url) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        return url.startsWith('/');
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);

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
            authors: post.authors?.map((author: { name: string }) => author.name) || undefined,
            images: post.feature_image ? [post.feature_image] : undefined,
        },
        alternates: {
            canonical: `/blog/${post.slug}`
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
                wrapper.parentNode?.replaceChild(imgContainer, wrapper);
            }
        });
    };

    if (typeof window !== 'undefined') {
        setTimeout(replaceImageWrappers, 0);
    }

    return null;
}

export default async function BlogPost({ params }: Props) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const processedHtml = processHtml(post.html);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.feature_image || undefined,
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: post.authors && post.authors[0] ? {
            '@type': 'Person',
            name: post.authors[0].name,
            url: post.authors[0].url || undefined
        } : {
            '@type': 'Organization',
            name: 'Top Contractors Denver'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Top Contractors Denver',
            logo: {
                '@type': 'ImageObject',
                url: 'https://topcontractorsdenver.com/logo.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://topcontractorsdenver.com/blog/${post.slug}`
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <article className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-8">
                    {post.feature_image && isValidImageUrl(post.feature_image) && (
                        <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                            <Image
                                src={post.feature_image}
                                alt={post.feature_image_alt || post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority
                                onError={(e) => {
                                    console.error('Feature image loading error:', {
                                        src: post.feature_image,
                                        error: e
                                    });
                                }}
                            />
                        </div>
                    )}
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <time dateTime={post.published_at}>
                            {formatDate(post.published_at)}
                        </time>
                        {post.reading_time && (
                            <>
                                <span>·</span>
                                <span>{post.reading_time} min read</span>
                            </>
                        )}
                    </div>
                    {(() => {
                        const author = post.authors?.[0];
                        if (!author) return null;

                        return (
                            <div className="flex items-center gap-3">
                                {author.profile_image && isValidImageUrl(author.profile_image) && (
                                    <Image
                                        src={author.profile_image}
                                        alt={author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                        onError={(e) => {
                                            console.error('Author image loading error:', {
                                                src: author.profile_image,
                                                error: e
                                            });
                                        }}
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{author.name}</p>
                                    {author.bio && (
                                        <p className="text-sm text-gray-600">{author.bio}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </header>

                {/* Blog post content with enhanced typography */}
                <Suspense
                    fallback={
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    }
                >
                    <BlogContentErrorBoundary>
                        <BlogContent html={processedHtml} />
                        <BlogImages />
                    </BlogContentErrorBoundary>
                </Suspense>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-xl font-semibold mb-4">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: { id: string; name: string; slug: string }) => (
                                <Link
                                    key={tag.id}
                                    href={`/blog/tag/${tag.slug}`}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </>
    );
}
