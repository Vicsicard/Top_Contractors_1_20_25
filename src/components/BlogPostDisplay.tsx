'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Post } from '@/types/blog';

interface BlogPostDisplayProps {
    post: Post;
}

export function BlogPostDisplay({ post }: BlogPostDisplayProps) {
    const [imageError, setImageError] = useState(false);
    const fallbackImage = '/images/denver-skyline.jpg';

    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
        }
    };

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8">
                {post.feature_image && (
                    <div className="relative aspect-[16/9] mb-6 rounded-lg overflow-hidden">
                        <Image
                            src={imageError ? fallbackImage : post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover"
                            onError={handleImageError}
                            sizes="(max-width: 1024px) 100vw, 1024px"
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
            <div 
                className="blog-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html }} 
            />
        </article>
    );
}
