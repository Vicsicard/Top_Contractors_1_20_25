export default function TradeBlogPostLoading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
            {/* Back navigation skeleton */}
            <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Feature image skeleton */}
            <div className="relative aspect-video mb-6 rounded-lg bg-gray-200"></div>
            
            {/* Title skeleton */}
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            
            {/* Meta info skeleton */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            
            {/* Author skeleton */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
            
            {/* Tags skeleton */}
            <div className="mt-8 pt-8 border-t">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}
