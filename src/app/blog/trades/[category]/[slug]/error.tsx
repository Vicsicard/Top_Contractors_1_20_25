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
        const logError = async () => {
            // Extract route parameters
            const pathParts = window.location.pathname.split('/');
            const category = pathParts[pathParts.indexOf('trades') + 1];
            const slug = pathParts[pathParts.indexOf('trades') + 2];

            // Log detailed error information
            console.error('Blog Post Route Error:', {
                message: error.message,
                digest: error.digest,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                pathname: window.location.pathname,
                category,
                slug,
                userAgent: window.navigator.userAgent,
                referrer: document.referrer || null
            });

            // Check Supabase connection status with retry
            let retries = 2;
            while (retries >= 0) {
                try {
                    const { data, error: connError } = await supabase
                        .from('posts')
                        .select('count')
                        .limit(1);

                    console.log('Supabase connection check:', {
                        success: !connError,
                        attempt: 2 - retries + 1,
                        error: connError ? {
                            message: connError.message,
                            code: connError.code,
                            details: connError.details || null
                        } : null,
                        timestamp: new Date().toISOString()
                    });

                    if (!connError) break;
                    
                    retries--;
                    if (retries >= 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (e) {
                    console.error('Failed to check Supabase connection:', {
                        error: e,
                        attempt: 2 - retries + 1,
                        timestamp: new Date().toISOString()
                    });
                    retries--;
                    if (retries >= 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        };

        logError();
    }, [error]);

    // Enhance error message with context
    const enhanceErrorMessage = () => {
        const baseMessage = 'Failed to load blog post';
        
        if (error.message.includes(baseMessage)) {
            return error.message;
        }

        if (error.message.includes('not found')) {
            return `${baseMessage}: The requested post could not be found`;
        }

        if (error.message.includes('timeout')) {
            return `${baseMessage}: Request timed out. Please try again`;
        }

        if (error.message.includes('Invalid URL parameters')) {
            return `${baseMessage}: Invalid URL format`;
        }

        return `${baseMessage}: ${error.message}`;
    };

    error.message = enhanceErrorMessage();

    return <BlogPostErrorBoundary error={error} reset={reset} />;
}
