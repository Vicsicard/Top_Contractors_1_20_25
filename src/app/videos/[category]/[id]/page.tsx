import { createClient } from '@/utils/supabase-server';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import RelatedVideoCard from '@/components/RelatedVideoCard';
import VideoChapters from '@/components/VideoChapters';
import Link from 'next/link';
import type { Database } from '@/types/supabase';
import { Metadata, ResolvingMetadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

type Video = Database['public']['Tables']['videos']['Row'];

interface VideoPageProps {
  params: {
    category: string;
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: VideoPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient();
  
  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: video.title,
    description: video.description || `Watch ${video.title} - Top Contractors Denver`,
    openGraph: {
      title: video.title,
      description: video.description || `Watch ${video.title} - Top Contractors Denver`,
      type: 'video.other',
      videos: [{
        url: `https://www.youtube.com/watch?v=${video.youtube_id}`,
        type: 'text/html',
      }],
      images: [
        {
          url: `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: video.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.description || `Watch ${video.title} - Top Contractors Denver`,
      images: [`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const supabase = createClient();
  
  // Fetch the current video
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    throw error; // This will be caught by the error boundary
  }

  if (!video) {
    notFound();
  }

  // Fetch related videos in the same category
  const { data: relatedVideos, error: relatedError } = await supabase
    .from('videos')
    .select('*')
    .eq('category', params.category)
    .neq('id', params.id)
    .order('created_at', { ascending: false })
    .limit(3);

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
                {video.related_services.map((service: string) => (
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

          {/* Video Chapters */}
          {video.timestamps && Object.keys(video.timestamps).length > 0 && (
            <VideoChapters timestamps={video.timestamps as Record<string, string>} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
          {relatedError ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600">Failed to load related videos</p>
            </div>
          ) : !relatedVideos || relatedVideos.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">No related videos found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo: Video) => (
                <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
