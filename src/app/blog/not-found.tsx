import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Blog Post Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the blog post you're looking for.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Blog
      </Link>
    </div>
  );
}
