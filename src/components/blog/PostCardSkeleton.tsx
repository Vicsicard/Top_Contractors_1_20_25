export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      <div className="p-6 flex-grow flex flex-col">
        {/* Title skeleton */}
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />

        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Metadata skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}
