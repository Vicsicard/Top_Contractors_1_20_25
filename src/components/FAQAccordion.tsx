'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I hire a contractor in Denver?',
    a: 'Browse our directory by service type, review contractor profiles and ratings, then submit a free quote request. We connect you directly with verified local professionals who specialize in your project.',
  },
  {
    q: 'Are the contractors on your platform licensed and insured?',
    a: 'Yes. Every contractor in our network is required to hold valid state licensing and carry appropriate insurance coverage before being listed. We verify credentials as part of our vetting process.',
  },
  {
    q: 'How much does it cost to get a quote?',
    a: 'Getting quotes through our platform is completely free. There is no obligation to hire and no fees for homeowners. Simply submit your project details and receive quotes from qualified local contractors.',
  },
  {
    q: 'How long does a typical home improvement project take in Denver?',
    a: 'Project timelines vary by scope. Minor repairs may take a day or two, while full remodels can take several weeks. Your contractor will provide a detailed timeline during the quoting process based on your specific project.',
  },
  {
    q: 'What areas in the Denver metro do your contractors serve?',
    a: 'Our contractors serve the entire Denver metro area including Denver, Aurora, Lakewood, Arvada, Westminster, Thornton, Centennial, Highlands Ranch, Littleton, Englewood, and surrounding communities.',
  },
  {
    q: 'What types of home improvement projects can I find contractors for?',
    a: 'We cover all major trades including kitchen remodeling, bathroom remodeling, roofing, HVAC, plumbing, electrical, flooring, painting, landscaping, fencing, windows, siding, masonry, and general contracting.',
  },
  {
    q: 'How do I compare contractors before hiring?',
    a: 'Each contractor profile includes their service area, specialties, and verified reviews from real Denver homeowners. You can request multiple quotes and compare pricing, timelines, and credentials before making a decision.',
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-150"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-primary-dark text-sm sm:text-base pr-4">
              {faq.q}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
