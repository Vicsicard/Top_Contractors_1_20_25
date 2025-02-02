import Image from 'next/image';

interface ServerImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

export default function ServerImage({
    src,
    alt,
    fill = false,
    className = '',
    sizes,
    priority = false
}: ServerImageProps) {
    const loader = ({ src }: { src: string }) => {
        return src;
    };

    return (
        <Image
            loader={loader}
            src={src}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            unoptimized
        />
    );
}
