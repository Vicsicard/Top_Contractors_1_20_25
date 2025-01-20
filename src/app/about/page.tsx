import React from 'react';

export const metadata = {
  title: 'About Us | Top Contractors',
  description: 'Learn more about Top Contractors and our mission to connect you with the best contractors in your area.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      
      <section className="prose lg:prose-xl">
        <p className="mb-6">
          Welcome to Top Contractors, your trusted platform for finding and connecting with the most qualified contractors in your area.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our mission is to simplify the process of finding reliable, skilled contractors for your projects. We carefully vet and showcase top professionals across various trades to ensure quality and reliability.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What Sets Us Apart</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Rigorous contractor verification process</li>
          <li>Comprehensive service coverage across multiple trades</li>
          <li>User-friendly platform for easy contractor discovery</li>
          <li>Commitment to quality and customer satisfaction</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
        <p className="mb-6">
          We believe in transparency, quality, and reliability. Our platform is built on these core values to ensure the best possible experience for both contractors and clients.
        </p>
      </section>
    </main>
  );
}
