'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill';
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  objectFit = 'cover',
  quality = 85
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [supportsWebP, setSupportsWebP] = useState(true);

  // Check WebP support
  useEffect(() => {
    const checkWebP = async () => {
      const webP = new window.Image();
      webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
      webP.onload = () => setSupportsWebP(true);
      webP.onerror = () => setSupportsWebP(false);
    };
    checkWebP().catch(() => setSupportsWebP(false));
  }, []);

  // Convert image URL to WebP if supported
  const imageUrl = supportsWebP && src.match(/\.(jpg|jpeg|png)$/i) 
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'}
          ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        quality={quality}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
    </div>
  );
}
