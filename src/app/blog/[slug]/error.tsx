'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface Props {
    error: Error;
    reset: () => void;
}

export default function BlogPostError({ error, reset }: Props) {
    useEffect(() => {
        // Log the error to your error reporting service
        console.error('Blog post error:', error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Unable to Load Blog Post
                </h1>
                <p className="text-gray-600 mb-8">
                    We encountered an error while trying to load this blog post. This might be due to a temporary issue or the post may no longer be available.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/blog"
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Return to Blog
                    </Link>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-red-50 rounded-lg">
                        <p className="text-red-800 font-mono text-sm break-all">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
