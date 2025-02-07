export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
      
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
}
