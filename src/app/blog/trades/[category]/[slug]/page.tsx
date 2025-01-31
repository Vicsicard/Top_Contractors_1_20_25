import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/supabase-blog';
import { JsonLd } from '@/components/json-ld';
import { processHtml } from '@/utils/html-processor';
import Image from 'next/image';

interface Props {
    params: {
        slug: string;
        category: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
    const post = await getPostBySlug(params.slug, params.category);

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
        author: {
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
            '@id': `https://topcontractorsdenver.com/blog/trades/${params.category}/${post.slug}`
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <article className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-8">
                    {post.feature_image && (
                        <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                            <Image
                                src="/images/denver-skyline.jpg"
                                alt={post.feature_image_alt || post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <time dateTime={post.published_at}>
                            {new Date(post.published_at).toLocaleDateString()}
                        </time>
                        {post.reading_time && (
                            <>
                                <span>·</span>
                                <span>{post.reading_time} min read</span>
                            </>
                        )}
                    </div>
                </header>
                <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
            </article>
        </>
    );
}
