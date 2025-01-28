'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class BlogContentErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error): void {
        console.error('Blog content error:', error);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">
                        Content Display Error
                    </h2>
                    <p className="text-red-600">
                        We encountered an error while displaying this content. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
