import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/utils/supabase-blog';
import { formatDate } from '@/utils/date';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';
import { Author, Tag } from '@/types/blog';

interface Props {
    params: {
        trade: string;
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
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

export default async function TradeBlogPost({ params }: Props) {
    const post = await getPostBySlug(params.slug);
    const trade = tradesData[params.trade];

    if (!post || !trade) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.feature_image || undefined,
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: post.authors?.[0] ? {
            '@type': 'Person',
            name: post.authors[0].name,
            url: post.authors[0].url || undefined
        } : undefined,
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
            '@id': `https://topcontractorsdenver.com/blog/trades/${params.trade}/${post.slug}`
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <article className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-8">
                    <nav className="mb-6">
                        <Link
                            href={`/blog/trades/${params.trade}`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ← Back to {trade.title} Blog
                        </Link>
                    </nav>

                    {post.feature_image && (
                        <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                            <Image
                                src={post.feature_image}
                                alt={post.feature_image_alt || post.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority
                                onError={(e) => {
                                    console.error('Image loading error:', {
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
                    {post.authors?.[0] && (
                        <div className="flex items-center gap-3">
                            {post.authors[0].profile_image && (
                                <Image
                                    src={post.authors[0].profile_image}
                                    alt={post.authors[0].name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    onError={(e) => {
                                        console.error('Author image loading error:', {
                                            src: post.authors[0].profile_image,
                                            error: e
                                        });
                                    }}
                                />
                            )}
                            <div>
                                <p className="font-medium">{post.authors[0].name}</p>
                                {post.authors[0].bio && (
                                    <p className="text-sm text-gray-600">{post.authors[0].bio}</p>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    
                    {/* Process any next-image-wrapper divs after the content is rendered */}
                    <script dangerouslySetInnerHTML={{ __html: `
                        document.querySelectorAll('.next-image-wrapper').forEach(wrapper => {
                            const src = wrapper.getAttribute('data-image-src');
                            const alt = wrapper.getAttribute('data-image-alt');
                            const width = parseInt(wrapper.getAttribute('data-image-width') || '1200');
                            const height = parseInt(wrapper.getAttribute('data-image-height') || '675');
                            
                            if (src) {
                                const img = document.createElement('img');
                                img.src = src;
                                img.alt = alt || '';
                                img.width = width;
                                img.height = height;
                                img.className = 'w-full h-auto rounded-lg';
                                img.style.aspectRatio = '16/9';
                                img.loading = 'lazy';
                                wrapper.appendChild(img);
                            }
                        });
                    `}} />
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-xl font-semibold mb-4">Tags</h2>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: Tag) => (
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
