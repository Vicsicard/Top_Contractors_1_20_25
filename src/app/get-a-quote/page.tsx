'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const TRADE_CATEGORIES = [
  'Electricians',
  'HVAC',
  'Roofers',
  'Painters',
  'Landscapers',
  'Plumbers',
  'Kitchen Remodeling',
  'Bathroom Remodeling',
  'Home Remodeling',
  'Siding & Gutters',
  'Masonry',
  'Decks',
  'Flooring',
  'Windows',
  'Fencing',
  'Epoxy Garage',
  'Other'
];

const TIMELINES = [
  'ASAP (Within 1 week)',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  'Just planning / Not sure yet'
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000',
  'Not sure yet'
];

const CONTACT_METHODS = [
  'Email',
  'Phone Call',
  'Text Message',
  'Any method works'
];

export default function GetQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    project_type: '',
    description: '',
    timeline: '',
    budget_range: '',
    zip_code: '',
    full_name: '',
    email: '',
    phone: '',
    preferred_contact: '',
    company_name: '' // Honeypot field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input
  };

  const validateForm = (): string | null => {
    // Check honeypot
    if (formData.company_name) {
      return 'Invalid submission detected';
    }

    // Required fields
    if (!formData.project_type) return 'Please select a project type';
    if (!formData.description || formData.description.length < 20) {
      return 'Please provide a description of at least 20 characters';
    }
    if (formData.description.length > 1000) {
      return 'Description must be less than 1000 characters';
    }
    if (!formData.timeline) return 'Please select a timeline';
    if (!formData.zip_code) return 'Please enter your ZIP code';
    if (!/^\d{5}$/.test(formData.zip_code)) {
      return 'ZIP code must be exactly 5 digits';
    }
    if (!formData.full_name) return 'Please enter your full name';
    if (!formData.email) return 'Please enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.preferred_contact) return 'Please select a preferred contact method';

    // Optional phone validation
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      return 'Please enter a valid phone number';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare submission data without honeypot field
      const { company_name: _company_name, ...cleanData } = formData;
      const submissionData = {
        ...cleanData,
        source_page: window.location.href
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      // Success - redirect to confirmation page
      router.push('/request-received');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">
            Get Free Project Quotes
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tell us about your project and we&apos;ll connect you with qualified contractors in your area.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Type */}
            <div>
              <label htmlFor="project_type" className="block text-sm font-semibold text-gray-700 mb-2">
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                id="project_type"
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a service...</option>
                {TRADE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Please describe your project in detail (20-1000 characters)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                When do you need this done? <span className="text-red-500">*</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a timeline...</option>
                {TIMELINES.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="budget_range" className="block text-sm font-semibold text-gray-700 mb-2">
                Budget Range (Optional)
              </label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a budget range...</option>
                {BUDGET_RANGES.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="zip_code" className="block text-sm font-semibold text-gray-700 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                required
                maxLength={5}
                placeholder="80202"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(303) 555-1234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Preferred Contact */}
            <div>
              <label htmlFor="preferred_contact" className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Contact Method <span className="text-red-500">*</span>
              </label>
              <select
                id="preferred_contact"
                name="preferred_contact"
                value={formData.preferred_contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a contact method...</option>
                {CONTACT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Get Free Quotes'}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              By submitting this form, you agree to be contacted by qualified contractors about your project.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
