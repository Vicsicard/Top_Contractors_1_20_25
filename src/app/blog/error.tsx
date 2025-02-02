'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-8">
        {error.message || 'An error occurred while loading the blog posts.'}
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
