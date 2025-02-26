import Image from 'next/image';

interface StaticImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
    quality?: number;
}

export function StaticImage({
    src,
    alt,
    fill = false,
    className = '',
    sizes = "(max-width: 768px) 100vw, 50vw",
    priority = false,
    quality = 80
}: StaticImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            className={className}
            sizes={sizes}
            priority={priority}
            quality={quality}
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48ZmlsdGVyIGlkPSJiIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMiIgLz48L2ZpbHRlcj48cGF0aCBmaWxsPSIjOWFhN2I4IiBkPSJNMCAwaDQwMHYyMjVIMHoiLz48ZyBmaWx0ZXI9InVybCgjYikiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNiAxLjYpIHNjYWxlKDEuNTYyNSkiIG9wYWNpdHk9IjAuNSI+PHBhdGggZmlsbD0iIzQyNDg2YSIgZD0iTTAgMGg0MDB2MjI1SDB6Ii8+PC9nPjwvc3ZnPg=="
        />
    );
}
