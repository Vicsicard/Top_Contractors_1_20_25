'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
    fallbackSrc?: string;
}

export function OptimizedImage({
    src,
    alt,
    fill = false,
    className = '',
    sizes,
    priority = false,
    fallbackSrc = '/images/denver-skyline.jpg'
}: OptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        // Reset image source if prop changes
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            onLoadingComplete={(result) => {
                if (result.naturalWidth === 0) {
                    // Image failed to load
                    setImgSrc(fallbackSrc);
                }
            }}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
