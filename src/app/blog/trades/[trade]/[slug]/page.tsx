import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug } from '@/utils/ghost';
import { tradesData } from '@/lib/trades-data';
import { formatDate } from '@/utils/date';
import { JsonLd } from '@/components/json-ld';

interface Props {
    params: {
        trade: string;
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { trade, slug } = params;
    const tradeData = tradesData[trade];
    const post = await getPostBySlug(slug);

    if (!tradeData || !post) {
        return {
            title: 'Post Not Found | Top Contractors Denver Blog',
            description: 'The requested blog post could not be found.',
            robots: 'noindex, nofollow'
        };
    }

    return {
        title: `${post.title} | ${tradeData.title} Blog`,
        description: post.excerpt || `Read this ${tradeData.title.toLowerCase()} article on Top Contractors Denver.`,
        openGraph: {
            title: post.title,
            description: post.excerpt || `Read this ${tradeData.title.toLowerCase()} article on Top Contractors Denver.`,
            type: 'article',
            images: post.feature_image ? [{ url: post.feature_image }] : undefined,
        },
        alternates: {
            canonical: `/blog/trades/${trade}/${slug}`
        }
    };
}

export default async function TradeBlogPostPage({ params }: Props) {
    const { trade, slug } = params;
    const tradeData = tradesData[trade];
    const post = await getPostBySlug(slug);

    if (!tradeData || !post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Trade Navigation */}
            <div className="mb-8">
                <Link
                    href={`/blog/trades/${trade}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to {tradeData.title} Blog
                </Link>
            </div>

            {/* Post Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div className="flex items-center text-gray-600 mb-8">
                    <time dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                    </time>
                    <span className="mx-2">·</span>
                    <span>{tradeData.title}</span>
                </div>
                {post.feature_image && (
                    <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            priority
                        />
                    </div>
                )}
            </header>

            {/* Post Content */}
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html || '' }}
            />

            {/* Footer Navigation */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
                <Link
                    href={`/blog/trades/${trade}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    ← Back to {tradeData.title} Blog
                </Link>
            </footer>

            {/* Structured Data */}
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": post.title,
                    "description": post.excerpt || `Read this ${tradeData.title.toLowerCase()} article on Top Contractors Denver.`,
                    "image": post.feature_image,
                    "datePublished": post.published_at,
                    "dateModified": post.updated_at || post.published_at,
                    "author": {
                        "@type": "Organization",
                        "name": "Top Contractors Denver"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Top Contractors Denver",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://topcontractorsdenver.com/logo.png"
                        }
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://topcontractorsdenver.com/blog/trades/${trade}/${slug}`
                    }
                }}
            />
        </article>
    );
}
