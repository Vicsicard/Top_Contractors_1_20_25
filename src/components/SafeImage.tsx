'use client';

import Image from 'next/image';

interface SafeImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

export function SafeImage({
    src,
    alt,
    fill = false,
    className = '',
    sizes,
    priority = false
}: SafeImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            blurDataURL="/images/denver-skyline.jpg"
            placeholder="blur"
        />
    );
}
