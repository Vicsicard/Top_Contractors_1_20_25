import { createClient } from '@/utils/supabase-server';
import VideoCard from '@/components/VideoCard';
import type { Database } from '@/types/supabase';

export const revalidate = 3600; // Cache for 1 hour

type Video = Database['public']['Tables']['videos']['Row'];
type VideoCategoryMap = Record<string, Video[]>;

// Helper function to sort videos by date
const sortVideosByDate = (videos: Video[]) => {
  return [...videos].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export default async function VideosPage() {
  const supabase = createClient();
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Videos</h3>
          <p className="text-gray-600">There was a problem loading the video content. Please try again later.</p>
          <p className="text-sm text-red-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Group and sort videos by category
  const videosByCategory = videos?.reduce((acc: VideoCategoryMap, video: Video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category] = sortVideosByDate([...acc[video.category], video]);
    return acc;
  }, {} as VideoCategoryMap);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Gallery</h1>
      <p className="text-gray-600 mb-8">Watch our latest videos about home improvement, contractor tips, and more.</p>
      
      {videosByCategory && (Object.entries(videosByCategory) as [string, Video[]][]).map(([category, categoryVideos]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {category.replace(/-/g, ' ')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryVideos.map((video: Video, index: number) => (
              <VideoCard key={video.id} video={video} isPriority={index === 0} />
            ))}
          </div>
        </div>
      ))}

      {(!videos || videos.length === 0) && !error && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Videos Found</h3>
            <p className="text-gray-600">We&apos;re currently working on adding new video content. Please check back soon!</p>
          </div>
        </div>
      )}
    </div>
  );
}
