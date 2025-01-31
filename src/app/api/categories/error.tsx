'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Categories API Error:', error);
  }, [error]);

  return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg font-semibold text-red-800">
          Error Loading Categories
        </h2>
        <p className="text-red-600">
          {error.message || 'An unexpected error occurred while loading categories.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
