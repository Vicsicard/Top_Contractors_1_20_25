import { notFound } from 'next/navigation';
import { tradesData } from '@/lib/trades-data';
import type { Metadata } from 'next';

type Props = {
  params: { trade: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = tradesData[params.trade];
  
  if (!trade) {
    return {
      title: 'Trade Not Found',
    };
  }

  return {
    title: trade.metaTitle,
    description: trade.metaDescription,
  };
}

export default function TradePage({ params }: Props) {
  const trade = tradesData[params.trade];

  if (!trade) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{trade.heading}</h1>
      <h2 className="text-2xl text-gray-600 mb-8">{trade.subheading}</h2>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-8">{trade.description}</p>
        
        <h3 className="text-2xl font-semibold mb-4">Our Services</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {trade.services.map((service) => (
            <li key={service} className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              {service}
            </li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mb-4">Why Choose Us</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {trade.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {trade.faqQuestions.map((faq, index) => (
            <div key={index}>
              <h4 className="text-xl font-semibold mb-2">{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
