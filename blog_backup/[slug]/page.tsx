import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug } from '@/utils/ghost';

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

    // Create a clean excerpt without HTML tags, limited to ~155 characters
    const cleanExcerpt = post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 155) + '...' || '';
    const cleanTitle = post.title?.length > 60 ? post.title.slice(0, 57) + '...' : post.title;

    return {
        title: `${cleanTitle} | Top Contractors Denver Blog`,
        description: cleanExcerpt,
        keywords: post.tags?.map(tag => tag.name).join(', '),
        alternates: {
            canonical: `https://topcontractorsdenver.com/blog/${post.slug}`
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: cleanTitle,
            description: cleanExcerpt,
            url: `https://topcontractorsdenver.com/blog/${post.slug}`,
            siteName: 'Top Contractors Denver',
            locale: 'en_US',
            type: 'article',
            images: post.feature_image ? [post.feature_image] : [],
            authors: post.authors?.map(author => author.name) || ['Top Contractors Denver'],
            publishedTime: post.published_at,
            modifiedTime: post.updated_at,
        },
        authors: post.authors?.map(author => ({ name: author.name })) || [{ name: 'Top Contractors Denver' }],
        publisher: 'Top Contractors Denver',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
    };
}

export default async function BlogPost({ params }: Props) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                    <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString()}
                    </time>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                </div>
                {post.feature_image && (
                    <div className="relative aspect-video mb-8">
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                )}
            </header>
            
            <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html || '' }}
            />

            {/* Structured Data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.title,
                        description: post.excerpt,
                        image: post.feature_image,
                        datePublished: post.published_at,
                        dateModified: post.updated_at,
                        author: post.authors?.map(author => ({
                            '@type': 'Person',
                            name: author.name,
                        })) || [{
                            '@type': 'Organization',
                            name: 'Top Contractors Denver',
                        }],
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
                    })
                }}
            />
        </article>
    );
}
