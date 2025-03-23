'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface VideoThumbnailProps {
  youtubeId: string;
  title: string;
  isPriority?: boolean;
}

export default function VideoThumbnail({ youtubeId, title, isPriority = false }: VideoThumbnailProps) {
  const [currentQuality, setCurrentQuality] = useState('maxresdefault');
  
  // Check if high quality thumbnail is available
  useEffect(() => {
    const img = new window.Image();
    img.src = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    img.onload = () => setCurrentQuality('maxresdefault');
    img.onerror = () => setCurrentQuality('mqdefault');
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [youtubeId]);

  return (
    <Image
      src={`https://img.youtube.com/vi/${youtubeId}/${currentQuality}.jpg`}
      alt={title}
      fill
      priority={isPriority}
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7lMuwAAAABJRU5ErkJggg=="
    />
  );
}
