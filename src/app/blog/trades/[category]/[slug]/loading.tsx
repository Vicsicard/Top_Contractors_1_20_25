export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="animate-pulse">
                {/* Header skeleton */}
                <div className="mb-8">
                    {/* Image placeholder */}
                    <div className="relative w-full h-[400px] mb-6 rounded-lg bg-gray-200" />
                    
                    {/* Title placeholder */}
                    <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
                    
                    {/* Meta info placeholder */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-4" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-4">
                    {/* Paragraph placeholders */}
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-11/12" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-9/12" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-10/12" />
                    <div className="h-4 bg-gray-200 rounded w-7/12" />
                </div>

                {/* Additional content blocks */}
                <div className="mt-8 space-y-6">
                    {/* Section placeholders */}
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-11/12" />
                            <div className="h-4 bg-gray-200 rounded w-4/5" />
                        </div>
                    </div>
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-10/12" />
                            <div className="h-4 bg-gray-200 rounded w-9/12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
