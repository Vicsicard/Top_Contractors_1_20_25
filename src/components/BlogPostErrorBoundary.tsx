'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface Props {
    error: Error & { digest?: string };
    reset: () => void;
}

export function BlogPostErrorBoundary({ error, reset }: Props) {
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [errorDetails, setErrorDetails] = useState<string>('');

    useEffect(() => {
        // Log the error to console for debugging
        console.error('Blog Post Error:', {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString()
        });

        // Set error details based on error type
        if (error.message.includes('Authentication failed')) {
            setErrorDetails('authentication');
        } else if (error.message.includes('Failed to connect')) {
            setErrorDetails('connection');
        } else if (error.message.includes('not found')) {
            setErrorDetails('not-found');
        } else if (error.message.includes('Invalid URL parameters')) {
            setErrorDetails('invalid-params');
        } else if (error.message.includes('Unable to display blog post content')) {
            setErrorDetails('content-error');
        } else if (error.message.includes('Operation timed out')) {
            setErrorDetails('timeout');
        } else {
            setErrorDetails('unknown');
        }

        // Check if it's an authentication error
        if (error.message.includes('Authentication failed')) {
            // Attempt to refresh the Supabase session
            supabase.auth.refreshSession().catch(console.error);
        }
    }, [error]);

    const handleRetry = async () => {
        setIsRetrying(true);
        try {
            // Add delay between retries
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

            // Check Supabase connection
            const { data, error: connError } = await supabase
                .from('posts')
                .select('count')
                .limit(1);

            if (connError) {
                throw connError;
            }

            // If connection is good, reset the error boundary
            setRetryCount(prev => prev + 1);
            reset();
        } catch (e) {
            console.error('Retry failed:', e);
        } finally {
            setIsRetrying(false);
        }
    };

    const getErrorMessage = () => {
        switch (errorDetails) {
            case 'authentication':
                return 'We\'re having trouble accessing the blog post. This might be due to an authentication issue.';
            case 'connection':
                return 'We\'re having trouble connecting to our servers. Please check your internet connection.';
            case 'not-found':
                return 'The requested blog post could not be found.';
            case 'invalid-params':
                return 'The blog post URL appears to be invalid or incomplete.';
            case 'content-error':
                return 'We\'re having trouble displaying the blog post content.';
            case 'timeout':
                return 'The blog post is taking too long to load.';
            default:
                return 'We encountered an error while trying to load this blog post.';
        }
    };

    const getErrorList = () => {
        switch (errorDetails) {
            case 'authentication':
                return [
                    'Our authentication token might have expired',
                    'There might be a temporary server issue',
                    'Try refreshing the page'
                ];
            case 'connection':
                return [
                    'Your internet connection might be unstable',
                    'Our servers might be experiencing high load',
                    'Try again in a few moments'
                ];
            case 'not-found':
                return [
                    'The post may have been moved or deleted',
                    'The URL might be incorrect',
                    'Check if you typed the URL correctly'
                ];
            case 'invalid-params':
                return [
                    'The URL might be missing required information',
                    'Check if you copied the entire URL',
                    'Try accessing the post from the blog listing page'
                ];
            case 'content-error':
                return [
                    'The post content might be temporarily unavailable',
                    'Our content processing system might be experiencing issues',
                    'Try refreshing the page'
                ];
            case 'timeout':
                return [
                    'The server is taking longer than expected to respond',
                    'There might be high server load',
                    'Try again in a few moments'
                ];
            default:
                return [
                    'The post may have been moved or deleted',
                    'There might be a temporary connection issue',
                    'The URL might be incorrect'
                ];
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Unable to load blog post
                </h1>
                <p className="text-gray-600 mb-6">
                    {getErrorMessage()}
                </p>
                <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
                    {getErrorList().map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <div className="space-x-4">
                    <button
                        onClick={() => window.location.href = '/blog'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Return to Blog
                    </button>
                    <button
                        onClick={handleRetry}
                        disabled={isRetrying || retryCount >= 3}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                            isRetrying || retryCount >= 3
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                        }`}
                    >
                        {isRetrying ? 'Retrying...' : retryCount >= 3 ? 'Too many retries' : 'Try Again'}
                    </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                        <p className="text-sm font-mono text-gray-800">
                            Error: {error.message}
                        </p>
                        <p className="text-sm font-mono text-gray-600 mt-2">
                            Retry count: {retryCount}
                        </p>
                        {error.digest && (
                            <p className="text-sm font-mono text-gray-600 mt-2">
                                Error digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
