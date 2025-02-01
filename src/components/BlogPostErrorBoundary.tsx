'use client';

import { useEffect } from 'react';

interface Props {
    error: Error;
    reset: () => void;
}

export function BlogPostErrorBoundary({ error, reset }: Props) {
    useEffect(() => {
        // Log the error to console for debugging
        console.error('Blog Post Error:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Unable to load blog post
                </h1>
                <p className="text-gray-600 mb-6">
                    We encountered an error while trying to load this blog post. This might be because:
                </p>
                <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
                    <li>The post may have been moved or deleted</li>
                    <li>There might be a temporary connection issue</li>
                    <li>The URL might be incorrect</li>
                </ul>
                <div className="space-x-4">
                    <button
                        onClick={() => window.location.href = '/blog'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Return to Blog
                    </button>
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Try Again
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                        <p className="text-sm font-mono text-gray-800">
                            Error: {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
