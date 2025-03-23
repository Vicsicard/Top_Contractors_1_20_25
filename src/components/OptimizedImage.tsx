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
        const img = new window.Image();
        img.src = src;
        img.onload = () => setImgSrc(src);
        img.onerror = () => setImgSrc(fallbackSrc);
        
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, fallbackSrc]);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7lMuwAAAABJRU5ErkJggg=="
        />
    );
}
