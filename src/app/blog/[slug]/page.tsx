import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/utils/supabase-blog';
import { extractPostCategory } from '@/utils/ghost';
import { formatDate } from '@/utils/date';
import { tradesData } from '@/lib/trades-data';
import { JsonLd } from '@/components/json-ld';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return {
            title: 'Post Not Found | Top Contractors Denver',
            description: 'The requested blog post could not be found.',
            robots: 'noindex, nofollow'
        };
    }
    
    return {
        title: post.title + ' | Top Contractors Denver Blog',
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            type: 'article',
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
            authors: post.authors?.map(author => author.name) || [],
            images: post.feature_image ? [post.feature_image] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.title,
            images: post.feature_image ? [post.feature_image] : [],
        }
    };
}

export default async function BlogPost({ params }: Props) {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
        return notFound();
    }

    const category = extractPostCategory(post);
    const categoryData = category ? tradesData[category] : null;

    return (
        <main className="container mx-auto px-4 py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt || post.title,
                    image: post.feature_image ? [post.feature_image] : [],
                    datePublished: post.published_at,
                    dateModified: post.updated_at || post.published_at,
                    author: post.authors?.map(author => ({
                        '@type': 'Person',
                        name: author.name,
                    })) || [],
                    publisher: {
                        '@type': 'Organization',
                        name: 'Top Contractors Denver',
                        url: 'https://topcontractorsdenver.com',
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': `https://topcontractorsdenver.com/blog/${post.slug}`,
                    },
                }}
            />

            {/* Navigation */}
            <nav className="mb-8">
                <div className="flex flex-wrap gap-4 items-center text-sm">
                    <Link
                        href="/blog"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        ← Back to Blog
                    </Link>
                    {category && (
                        <>
                            <span className="text-gray-400">|</span>
                            <Link
                                href={`/blog?category=${category}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {categoryData?.title || category} Articles
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <article className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-6">
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
                    {post.feature_image && (
                        <div className="relative aspect-video w-full mb-8">
                            <Image
                                src={post.feature_image}
                                alt={post.feature_image_alt || post.title}
                                fill
                                className="object-cover rounded-lg"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    )}
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-lg font-semibold mb-4">Related Topics:</h2>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/blog?tag=${tag.slug}`}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Authors */}
                {post.authors && post.authors.length > 0 && (
                    <div className="mt-8 pt-8 border-t">
                        <h2 className="text-lg font-semibold mb-4">Written by:</h2>
                        <div className="flex flex-wrap gap-4">
                            {post.authors.map((author) => (
                                <div key={author.id} className="flex items-center gap-3">
                                    {author.profile_image && (
                                        <Image
                                            src={author.profile_image}
                                            alt={author.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium">{author.name}</div>
                                        {author.bio && (
                                            <p className="text-sm text-gray-600">{author.bio}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}
