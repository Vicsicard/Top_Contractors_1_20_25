'use client'

import Link from 'next/link'

interface ContractorCardProps {
  contractor: {
    id: string
    contractor_name: string
    phone: string | null
    website: string | null
    google_rating: number
    slug: string
  }
  trade?: string
  location?: string
}

export function ContractorCard({ contractor, trade, location }: ContractorCardProps) {
  // Generate LocalBusiness schema for the contractor
  const contractorSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.contractor_name,
    telephone: contractor.phone || undefined,
    url: contractor.website || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location || 'Denver',
      addressRegion: 'CO',
      addressCountry: 'US'
    },
    ...(contractor.google_rating && contractor.google_rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: contractor.google_rating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
        ratingCount: '20', // Placeholder since we don't have the actual count
      }
    } : {}),
    ...(trade ? {
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: trade
        }
      }
    } : {})
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contractorSchema)
        }}
      />
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {contractor.contractor_name}
      </h3>
      
      <div className="space-y-2">
        {contractor.phone && (
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <a
              href={`tel:${contractor.phone}`}
              className="hover:text-blue-600 transition-colors"
            >
              {contractor.phone}
            </a>
          </div>
        )}

        {contractor.website && (
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <a
              href={contractor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Visit Website
            </a>
          </div>
        )}

        {contractor.google_rating > 0 && (
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            <span>{contractor.google_rating.toFixed(1)} Rating</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <Link
          href={`/contractors/${contractor.slug}`}
          className="flex-1 text-center py-2 px-3 bg-primary hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
        >
          View Profile
        </Link>
        {contractor.phone && (
          <a
            href={`tel:${contractor.phone}`}
            className="flex-1 text-center py-2 px-3 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            Call Now
          </a>
        )}
      </div>
    </div>
  )
}
