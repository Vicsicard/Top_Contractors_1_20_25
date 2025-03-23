'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Post } from '@/types/blog';

interface BlogPostDisplayProps {
    post: Post;
}

export function BlogPostDisplay({ post }: BlogPostDisplayProps) {
    const fallbackImage = '/images/denver-skyline.jpg';

    useEffect(() => {
        console.log('BlogPostDisplay received post:', {
            title: post.title,
            htmlLength: post.html?.length || 0,
            htmlPreview: post.html?.substring(0, 500),
            hasHtml: !!post.html
        });
    }, [post]);

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8">
                {post.feature_image && (
                    <div className="relative aspect-[16/9] mb-6 rounded-lg overflow-hidden">
                        <Image
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            priority
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7lMuwAAAABJRU5ErkJggg=="
                        />
                    </div>
                )}
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <time dateTime={post.published_at || post.created_at}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
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
                dangerouslySetInnerHTML={{ __html: post.html || '' }} 
            />
        </article>
    );
}
