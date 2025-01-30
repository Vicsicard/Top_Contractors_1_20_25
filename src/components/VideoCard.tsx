'use client';

import Link from 'next/link';
import VideoThumbnail from './VideoThumbnail';
import type { Database } from '@/types/supabase';

type Video = Database['public']['Tables']['videos']['Row'];

export default function VideoCard({ video, isPriority = false }: { video: Video, isPriority?: boolean }) {
  return (
    <Link
      href={`/videos/${video.category}/${video.id}`}
      className="group"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="relative aspect-w-16 aspect-h-9">
          <VideoThumbnail
            youtubeId={video.youtube_id}
            title={video.title}
            isPriority={isPriority}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 line-clamp-2">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
