import { createClient } from '@/utils/supabase-server';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/types/supabase';

export const revalidate = 3600; // Revalidate every hour

type Video = Database['public']['Tables']['videos']['Row'];

export default async function VideosPage() {
  const supabase = createClient();
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Video[]>();

  if (error) {
    console.error('Error fetching videos:', error);
    return <div>Error loading videos</div>;
  }

  // Group videos by category
  const videosByCategory = videos?.reduce<Record<string, Video[]>>((acc: Record<string, Video[]>, video: Video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Gallery</h1>
      
      {videosByCategory && (Object.entries(videosByCategory) as [string, Video[]][]).map(([category, categoryVideos]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {category.replace(/-/g, ' ')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.category}/${video.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
                  <div className="relative aspect-w-16 aspect-h-9">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            ))}
          </div>
        </div>
      ))}

      {(!videos || videos.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-600">No videos available yet.</p>
        </div>
      )}
    </div>
  );
}
