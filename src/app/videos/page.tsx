import { createClient } from '@/utils/supabase-server';
import VideoCard from '@/components/VideoCard';
import type { Database } from '@/types/supabase';

export const revalidate = 0; // Disable caching

type Video = Database['public']['Tables']['videos']['Row'];
type VideoCategoryMap = Record<string, Video[]>;

export default async function VideosPage() {
  const supabase = createClient();
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Fetched videos:', videos);
  console.log('Fetch error:', error);

  if (error) {
    console.error('Error fetching videos:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Videos</h3>
          <p className="text-gray-600">There was a problem loading the video content. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group videos by category
  const videosByCategory = videos?.reduce((acc: VideoCategoryMap, video: Video) => {
    if (!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as VideoCategoryMap);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Gallery</h1>
      
      {videosByCategory && (Object.entries(videosByCategory) as [string, Video[]][]).map(([category, categoryVideos]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {category.replace(/-/g, ' ')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryVideos.map((video: Video, index: number) => (
              <VideoCard key={video.id} video={video} isPriority={index === 0} />
            ))}
          </div>
        </div>
      ))}

      {(!videos || videos.length === 0) && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Videos Found</h3>
            <p className="text-gray-600">We're currently working on adding new video content. Please check back soon!</p>
          </div>
        </div>
      )}
    </div>
  );
}
