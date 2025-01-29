import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import type { Database } from '@/types/supabase';

export const revalidate = 3600; // Revalidate every hour

type Video = Database['public']['Tables']['videos']['Row'];

interface VideoPageProps {
  params: {
    category: string;
    id: string;
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const supabase = createClient();
  
  // Fetch the current video
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .single<Video>();

  if (error || !video) {
    console.error('Error fetching video:', error);
    notFound();
  }

  // Fetch related videos in the same category
  const { data: relatedVideos } = await supabase
    .from('videos')
    .select('*')
    .eq('category', params.category)
    .neq('id', params.id)
    .limit(3)
    .returns<Video[]>();

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link
          href="/videos"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Videos
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <VideoPlayer
            youtubeId={video.youtube_id}
            title={video.title}
            description={video.description || undefined}
            transcript={video.transcript || undefined}
            showTranscript={true}
          />
          
          {/* Related Services */}
          {video.related_services && video.related_services.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Related Services</h3>
              <div className="flex flex-wrap gap-2">
                {video.related_services.map((service) => (
                  <Link
                    key={service}
                    href={`/services/${service}`}
                    className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {service.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          {video.timestamps && Object.keys(video.timestamps).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Video Chapters</h3>
              <div className="space-y-2">
                {Object.entries(video.timestamps).map(([time, label]) => (
                  <button
                    key={time}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      const seconds = time.split(':').reduce((acc, curr) => acc * 60 + parseInt(curr), 0);
                      // Note: You'll need to implement the seek functionality
                    }}
                  >
                    <span className="font-medium">{time}</span> - {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos?.map((relatedVideo) => (
              <Link
                key={relatedVideo.id}
                href={`/videos/${relatedVideo.category}/${relatedVideo.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={`https://img.youtube.com/vi/${relatedVideo.youtube_id}/maxresdefault.jpg`}
                      alt={relatedVideo.title}
                      className="object-cover w-full h-full"
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
                      {relatedVideo.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
