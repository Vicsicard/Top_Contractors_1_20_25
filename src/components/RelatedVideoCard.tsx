'use client';

import Link from 'next/link';
import VideoThumbnail from './VideoThumbnail';
import type { Database } from '@/types/supabase';

type Video = Database['public']['Tables']['videos']['Row'];

export default function RelatedVideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/videos/${video.category}/${video.id}`}
      className="block group"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative aspect-w-16 aspect-h-9">
          <VideoThumbnail
            youtubeId={video.youtube_id}
            title={video.title}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-3">
          <h4 className="font-medium group-hover:text-blue-600 line-clamp-2">
            {video.title}
          </h4>
        </div>
      </div>
    </Link>
  );
}
