import Image from 'next/image';

interface StaticImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

export function StaticImage({
    src,
    alt,
    fill = false,
    className = '',
    sizes,
    priority = false
}: StaticImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            unoptimized
        />
    );
}
