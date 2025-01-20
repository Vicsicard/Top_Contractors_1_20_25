import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Top Contractors',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="prose lg:prose-xl">
        <p className="mb-6">
          Last updated: January 20, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-6">
          We collect information that you provide directly to us when using our services, including:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Contact information (name, email, phone number)</li>
          <li>Project details and requirements</li>
          <li>Location information</li>
          <li>Communication preferences</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-6">
          We use the collected information to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Connect you with appropriate contractors</li>
          <li>Improve our services</li>
          <li>Communicate updates and relevant information</li>
          <li>Ensure platform security and prevent fraud</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information Security</h2>
        <p className="mb-6">
          We implement appropriate security measures to protect your personal information and maintain its confidentiality.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-6">
          If you have any questions about our privacy policy, please contact us.
        </p>
      </section>
    </main>
  );
}
