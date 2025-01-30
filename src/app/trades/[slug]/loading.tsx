export default function TradePageLoading() {
  return (
    <div className="container mx-auto px-4 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="py-4">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
      
      <div className="py-8">
        {/* Title skeleton */}
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-full bg-gray-200 rounded mb-8"></div>

        {/* Subregions skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Benefits section skeleton */}
        <div className="mt-12">
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog posts skeleton */}
        <div className="mt-16">
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ skeleton */}
        <div className="mt-16">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
