import Image from 'next/image';

interface SimpleImageProps {
    src: string;
    alt: string;
    className?: string;
}

export default function SimpleImage({ src, alt, className = '' }: SimpleImageProps) {
    return (
        <div className="relative w-full h-full">
            <Image
                src={src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover ${className}`}
                width={800}
                height={600}
                priority={false}
                loading="lazy"
            />
        </div>
    );
}
