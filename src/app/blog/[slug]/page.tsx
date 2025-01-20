import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug } from '@/utils/ghost';
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

    // Extract category and get trade data if available
    const category = extractPostCategory(post);
    const tradeData = category ? tradesData[category] : null;
    
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
        notFound();
    }

    // Extract category and get trade data if available
    const category = extractPostCategory(post);
    const tradeData = category ? tradesData[category] : null;

    // Generate schema for the blog post
    const blogPostSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || post.title,
        image: post.feature_image || undefined,
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: post.authors?.map(author => ({
            '@type': 'Person',
            name: author.name,
            image: author.profile_image
        })) || [],
        publisher: {
            '@type': 'Organization',
            name: 'Top Contractors Denver',
            logo: {
                '@type': 'ImageObject',
                url: 'https://topcontractorsdenver.com/images/logo.png'
            }
        }
    };

    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            <JsonLd data={blogPostSchema} />
            
            {/* Category Link */}
            {category && tradeData && (
                <Link 
                    href={`/blog?category=${category}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    {tradeData.icon && (
                        <Image
                            src={tradeData.icon}
                            alt={tradeData.title}
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                    )}
                    <span>{tradeData.title}</span>
                </Link>
            )}

            {/* Post Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                
                {/* Meta Information */}
                <div className="flex items-center text-gray-600 mb-4">
                    {post.authors?.[0] && (
                        <div className="flex items-center mr-6">
                            {post.authors[0].profile_image && (
                                <Image
                                    src={post.authors[0].profile_image}
                                    alt={post.authors[0].name}
                                    width={24}
                                    height={24}
                                    className="rounded-full mr-2"
                                />
                            )}
                            <span>{post.authors[0].name}</span>
                        </div>
                    )}
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    {post.reading_time && (
                        <span className="ml-6">{post.reading_time} min read</span>
                    )}
                </div>
                
                {/* Feature Image */}
                {post.feature_image && (
                    <div className="relative aspect-video mb-8">
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            priority
                        />
                    </div>
                )}
            </header>

            {/* Post Content */}
            <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html }}
            />
        </article>
    );
}
