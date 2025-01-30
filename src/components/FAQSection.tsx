'use client';

import { JsonLd } from '@/components/json-ld';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  category?: string;
}

export function FAQSection({ faqs, category }: FAQSectionProps) {
  // Prepare FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">
          {category ? `${category} FAQs` : 'Frequently Asked Questions'}
        </h2>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-3">
                {faq.question}
              </h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>

        {/* Inject FAQ Schema */}
        <JsonLd data={faqSchema} />
      </div>
    </section>
  );
}
