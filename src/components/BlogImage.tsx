'use client';

import { useRef } from 'react';

interface BlogImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function BlogImage({ src, alt, className = '' }: BlogImageProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const fallbackImage = '/images/denver-skyline.jpg';

    const handleError = () => {
        if (imgRef.current) {
            imgRef.current.src = fallbackImage;
        }
    };

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
}
