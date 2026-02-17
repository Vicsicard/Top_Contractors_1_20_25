import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Received | Top Contractors Denver',
  description: 'Your project request has been received. We\'ll connect you with qualified contractors soon.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RequestReceivedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-primary-dark mb-4">
            Request Received!
          </h1>

          {/* Confirmation Message */}
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <strong>Check your email for confirmation</strong>
            </p>
            
            <p className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <strong>We&apos;ll contact you within 24-48 hours</strong>
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">
              What Happens Next?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>We&apos;re reviewing your project details right now</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>We&apos;ll match you with qualified contractors in your area</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>A contractor will reach out using your preferred contact method</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>You&apos;ll receive free quotes and can choose the best fit for your project</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Return to Homepage
            </Link>
            <Link
              href="/blog"
              className="inline-block bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Browse Our Blog
            </Link>
          </div>

          {/* Support Note */}
          <p className="mt-8 text-sm text-gray-500">
            Questions? Email us at{' '}
            <a href="mailto:leads@topcontractorsdenver.com" className="text-primary hover:underline">
              leads@topcontractorsdenver.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
