'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
}

export function BlogImage({ src, alt, className = '', width = 800, height = 600 }: BlogImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const fallbackImage = '/images/denver-skyline.jpg';

    const handleError = () => {
        setImgSrc(fallbackImage);
    };

    return (
        <div className="relative">
            <Image
                src={imgSrc}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onError={handleError}
            />
        </div>
    );
}
