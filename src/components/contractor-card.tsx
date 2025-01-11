import React from 'react';
import { StarIcon, PhoneIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/20/solid';
import { Database } from '@/types/database';

type Contractor = Database['public']['Tables']['contractors']['Row'];

interface ContractorCardProps {
  contractor: Contractor;
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
        {contractor.contractor_name}
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
          <MapPinIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
          <span>{contractor.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
          <PhoneIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
          <a href={`tel:${contractor.phone}`} className="hover:text-blue-600">
            {contractor.phone}
          </a>
        </div>
        
        {contractor.website && (
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
            <GlobeAltIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
            <a
              href={contractor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-words"
            >
              Visit Website
            </a>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  i < Math.round(contractor.google_rating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({contractor.reviews_count || 0} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
