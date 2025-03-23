'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export interface BlogImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
}

export function BlogImage({ src, alt, className = '', width = 800, height = 600, priority = false }: BlogImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const fallbackImage = '/images/denver-skyline.jpg';

    // Check if the image is valid on mount
    useEffect(() => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => setImgSrc(src);
        img.onerror = () => setImgSrc(fallbackImage);
        
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return (
        <div className="relative">
            <Image
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                className={className}
                priority={priority}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7lMuwAAAABJRU5ErkJggg=="
            />
        </div>
    );
}
