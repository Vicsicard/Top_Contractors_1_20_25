'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

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
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize YouTube player when the API is ready
    const initPlayer = () => {
      if (!playerRef.current) return;
      
      new window.YT.Player(playerRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onError: (event) => {
            console.error('YouTube Player Error:', event);
          }
        }
      });
    };

    // If YT API is already loaded, initialize immediately
    if (window.YT) {
      initPlayer();
    } else {
      // If not loaded, set up callback for when it loads
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Cleanup
    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [youtubeId]);

  return (
    <div className={`video-container ${className}`}>
      {/* YouTube IFrame API Script */}
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />

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
        <div ref={playerRef} />
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
