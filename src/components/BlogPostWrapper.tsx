'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class BlogPostWrapper extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    // We only need to know that an error occurred, not the error details
    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Blog post error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Unable to Load Blog Post</h1>
                    <p className="text-gray-600 mb-6">
                        We encountered an error while trying to load this blog post. 
                        This might be due to a temporary issue or the post may no longer be available.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                        <a
                            href="/blog"
                            className="text-blue-600 px-6 py-2 hover:text-blue-700"
                        >
                            Return to Blog
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
