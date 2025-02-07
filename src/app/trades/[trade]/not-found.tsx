import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-bold mb-4">Trade Not Found</h2>
      <p className="text-xl text-gray-600 mb-8">
        Sorry, we couldn't find the trade service you're looking for.
      </p>
      <Link 
        href="/"
        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
