import VideoPlayer from '@/components/VideoPlayer';

export default function TestVideoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Video Page</h1>
      <VideoPlayer
        youtubeId="qpALFGCCjPU"
        title="How to Find a Contractor in Denver"
        description="Learn the essential steps to finding and hiring the right contractor for your home improvement project in Denver."
      />
    </div>
  );
}
