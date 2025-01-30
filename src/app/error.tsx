'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to your error reporting service
        console.error('Application Error:', error);
    }, [error]);

    // Ensure error message is safe to display
    const errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred. Our team has been notified and is working to fix the issue.';

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="max-w-xl text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">
                    Something went wrong!
                </h1>
                <p className="text-gray-600 mb-8">{errorMessage}</p>
                <div className="space-x-4">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try again
                    </button>
                    <Link 
                        href="/"
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium inline-block"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
