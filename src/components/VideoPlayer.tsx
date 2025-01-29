'use client';

import React from 'react';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  description?: string;
  transcript?: string;
  showTranscript?: boolean;
  className?: string;
}

export default function VideoPlayer({
  youtubeId,
  title,
  description,
  transcript,
  showTranscript = false,
  className = '',
}: VideoPlayerProps) {
  return (
    <div className={`video-container ${className}`}>
      {/* Schema.org VideoObject markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: title,
            description: description,
            thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            uploadDate: new Date().toISOString(),
            embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
          }),
        }}
      />

      {/* Video Player Container */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0&origin=${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onError={(e) => {
            console.error('Error loading video:', e);
            // You could set an error state here if needed
          }}
        />
      </div>

      {/* Video Title and Description */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>

      {/* Transcript Section */}
      {showTranscript && transcript && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Transcript</h3>
          <div className="prose max-w-none">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
}
