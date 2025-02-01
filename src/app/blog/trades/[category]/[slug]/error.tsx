'use client';

import { BlogPostErrorBoundary } from '@/components/BlogPostErrorBoundary';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <BlogPostErrorBoundary error={error} reset={reset} />;
}
