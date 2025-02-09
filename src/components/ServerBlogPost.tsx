import type { Post } from '@/types/blog';
import Image from 'next/image';

interface ServerBlogPostProps {
    post: Post;
}

export default function ServerBlogPost({ post }: ServerBlogPostProps) {
    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8">
                {post.feature_image && (
                    <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
                        <Image
                            src={post.feature_image}
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
            <div 
                className="blog-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html }} 
            />
        </article>
    );
}
