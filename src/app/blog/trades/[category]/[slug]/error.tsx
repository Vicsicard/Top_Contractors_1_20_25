'use client';

import { useEffect } from 'react';
import { BlogPostErrorBoundary } from '@/components/BlogPostErrorBoundary';
import { supabase } from '@/utils/supabase';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error with route context
        console.error('Blog Post Route Error:', {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: typeof window !== 'undefined' ? window.location.href : null,
            pathname: typeof window !== 'undefined' ? window.location.pathname : null
        });

        // Check Supabase connection status
        const checkConnection = async () => {
            try {
                const { data, error: connError } = await supabase
                    .from('posts')
                    .select('count')
                    .limit(1);

                console.log('Supabase connection check:', {
                    success: !connError,
                    error: connError ? {
                        message: connError.message,
                        code: connError.code
                    } : null,
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.error('Failed to check Supabase connection:', e);
            }
        };

        checkConnection();
    }, [error]);

    // Add route context to the original error
    if (!error.message.includes('Failed to load blog post')) {
        error.message = `Failed to load blog post: ${error.message}`;
    }

    return <BlogPostErrorBoundary error={error} reset={reset} />;
}
