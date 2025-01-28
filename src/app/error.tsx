'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to your error reporting service
        console.error('Blog Error:', error);
    }, [error]);

    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
            <div className="max-w-xl text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-6">
                    {error.message || 'An unexpected error occurred while loading the blog content.'}
                </p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
