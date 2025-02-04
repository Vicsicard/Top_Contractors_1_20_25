'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
    fallbackSrc?: string;
}

interface State {
    hasError: boolean;
}

export class ImageErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render() {
        const { src, alt, fill, className, sizes, priority, fallbackSrc = '/images/denver-skyline.jpg' } = this.props;

        if (this.state.hasError) {
            return (
                <Image
                    src={fallbackSrc}
                    alt={alt}
                    fill={fill}
                    className={className}
                    sizes={sizes}
                    priority={priority}
                />
            );
        }

        return (
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={className}
                sizes={sizes}
                priority={priority}
            />
        );
    }
}
