'use client';

import Image from 'next/image';
import { useState } from 'react';

interface VideoThumbnailProps {
  youtubeId: string;
  title: string;
  isPriority?: boolean;
}

export default function VideoThumbnail({ youtubeId, title, isPriority = false }: VideoThumbnailProps) {
  const [currentQuality, setCurrentQuality] = useState<'maxresdefault' | 'mqdefault'>('maxresdefault');

  return (
    <Image
      src={`https://img.youtube.com/vi/${youtubeId}/${currentQuality}.jpg`}
      alt={title}
      fill
      priority={isPriority}
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => {
        if (currentQuality === 'maxresdefault') {
          setCurrentQuality('mqdefault');
        }
      }}
    />
  );
}
