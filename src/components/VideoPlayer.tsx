'use client';

import React from 'react';
import Image from 'next/image';

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
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;
  const maxRetries = 3;

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setHasError(false);
      setIsLoading(true);
      setRetryCount(prev => prev + 1);
    }
  };

  return (
    <div className={`video-container relative ${className}`} data-error={hasError} data-loading={isLoading}>
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
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden relative shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0&origin=${origin}&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`w-full h-full ${hasError ? 'hidden' : ''}`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('Error loading video:', e);
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <p className="text-gray-600 mb-2">
              {retryCount >= maxRetries 
                ? "Unable to load video. Please try again later."
                : "Unable to load video"}
            </p>
            {retryCount < maxRetries && (
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Retry ({maxRetries - retryCount} attempts remaining)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fallback thumbnail while loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0">
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        </div>
      )}

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
