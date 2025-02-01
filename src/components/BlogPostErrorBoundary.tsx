'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export function BlogPostErrorBoundary({ error, reset }: Props) {
    const [isRetrying, setIsRetrying] = useState(false);
    const [errorType, setErrorType] = useState<string>('unknown');

    useEffect(() => {
        // Enhanced error logging with context
        console.error('Blog Post Error:', {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
            type: typeof error
        });

        // Improved error categorization
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('failed to load blog post')) {
            setErrorType('load-error');
        } else if (errorMessage.includes('invalid url parameters')) {
            setErrorType('invalid-url');
        } else if (errorMessage.includes('unable to display blog post content')) {
            setErrorType('content-error');
        } else if (errorMessage.includes('post not found')) {
            setErrorType('not-found');
        } else {
            setErrorType('unknown');
        }
    }, [error]);

    const handleRetry = () => {
        setIsRetrying(true);
        // Simple reset with loading state
        try {
            reset();
        } catch (e) {
            console.error('Error during retry:', e);
        } finally {
            setIsRetrying(false);
        }
    };

    const getErrorMessage = () => {
        switch (errorType) {
            case 'load-error':
                return 'We\'re having trouble loading this blog post. This might be temporary - please try again.';
            case 'invalid-url':
                return 'The URL you\'re trying to access appears to be invalid. Please check the link and try again.';
            case 'content-error':
                return 'We\'re having trouble displaying the content of this blog post. Please try refreshing the page.';
            case 'not-found':
                return 'We couldn\'t find the blog post you\'re looking for. It may have been moved or deleted.';
            default:
                return 'Something went wrong while trying to load this blog post. Please try again later.';
        }
    };

    const getErrorList = () => {
        switch (errorType) {
            case 'load-error':
                return [
                    'The server might be experiencing high load',
                    'Your internet connection might be unstable',
                    'Try refreshing the page or coming back in a few minutes'
                ];
            case 'invalid-url':
                return [
                    'Check if you typed or copied the URL correctly',
                    'The post might have been moved to a different location',
                    'Try finding the post through our blog listing page'
                ];
            case 'content-error':
                return [
                    'Clear your browser cache and try again',
                    'Try accessing the page in a different browser',
                    'If the problem persists, the post might need maintenance'
                ];
            case 'not-found':
                return [
                    'The post might have been removed or unpublished',
                    'The URL might have changed',
                    'Try searching for the post using our search feature'
                ];
            default:
                return [
                    'Try refreshing the page',
                    'Clear your browser cache',
                    'If the problem continues, please contact support'
                ];
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {errorType === 'not-found' ? 'Blog Post Not Found' : 'Unable to Load Blog Post'}
                </h1>
                <p className="text-gray-600 mb-6">
                    {getErrorMessage()}
                </p>
                <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
                    {getErrorList().map((item, index) => (
                        <li key={index} className="mb-2">{item}</li>
                    ))}
                </ul>
                <div className="space-x-4">
                    <button
                        onClick={() => window.location.href = '/blog'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Return to Blog
                    </button>
                    {errorType !== 'not-found' && (
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                                isRetrying
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                            }`}
                        >
                            {isRetrying ? 'Retrying...' : 'Try Again'}
                        </button>
                    )}
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                        <p className="text-sm font-mono text-gray-800">
                            Error: {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-sm font-mono text-gray-600 mt-2">
                                Error digest: {error.digest}
                            </p>
                        )}
                        <p className="text-sm font-mono text-gray-600 mt-2">
                            Error type: {errorType}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
