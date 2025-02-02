interface SimpleImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function SimpleImage({ src, alt, className = '' }: SimpleImageProps) {
    return (
        <div className="relative w-full h-full">
            <img
                src={src}
                alt={alt}
                className={`absolute inset-0 w-full h-full object-cover ${className}`}
                loading="lazy"
            />
        </div>
    );
}
