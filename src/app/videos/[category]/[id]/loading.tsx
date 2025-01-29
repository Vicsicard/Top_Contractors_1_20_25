export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Back Button */}
      <div className="mb-8">
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player Placeholder */}
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4" />
          
          {/* Title Placeholder */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Description Placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Related Services Placeholder */}
          <div className="mt-8">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-gray-200 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-2">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
