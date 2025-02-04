import Image from 'next/image';

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SimpleImage({ src, alt, className = '' }: SimpleImageProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
