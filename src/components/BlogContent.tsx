'use client';

import { useEffect, useState } from 'react';
import { BlogImage } from './BlogImage';
import type { Post } from '@/types/blog';
import { markdownToHtml } from '@/utils/markdown';

interface BlogContentProps {
    post: Post;
}

export function BlogContent({ post }: BlogContentProps) {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const convertContent = async () => {
            if (post.content) {
                const html = await markdownToHtml(post.content);
                setContent(html);
            }
        };
        convertContent();
    }, [post.content]);

    useEffect(() => {
        // Initialize Prism highlighting after content is set
        if (content && typeof window !== 'undefined') {
            // Dynamic import to avoid SSR issues
            import('prismjs').then((Prism) => {
                Prism.default.highlightAll();
            });
        }
    }, [content]);

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8">
                {post.feature_image && (
                    <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
                        <BlogImage
                            src={post.feature_image}
                            alt={post.feature_image_alt || post.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                )}
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <time dateTime={post.published_at || post.created_at}>
                        {new Date(post.published_at || post.created_at || '').toLocaleDateString()}
                    </time>
                    {post.reading_time && (
                        <>
                            <span>·</span>
                            <span>{post.reading_time} min read</span>
                        </>
                    )}
                    {post.tags && (
                        <>
                            <span>·</span>
                            <div className="flex flex-wrap gap-2">
                                {typeof post.tags === 'string' && 
                                  post.tags.split(',').filter(Boolean).map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </header>
            <div 
                className="blog-content prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-semibold
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                    prose-pre:!bg-gray-900 prose-pre:!p-4 prose-pre:!rounded-lg
                    prose-pre:overflow-x-auto prose-pre:scrollbar-thin prose-pre:scrollbar-thumb-gray-500
                    prose-img:rounded-lg prose-img:shadow-md
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:text-gray-700
                    prose-table:border-collapse
                    prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2
                    prose-td:border prose-td:border-gray-300 prose-td:p-2"
                dangerouslySetInnerHTML={{ __html: content }} 
            />
        </article>
    );
}
