import { Metadata } from 'next';
import { ClientNavigation } from '@/components/ClientNavigation';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Blog | Top Contractors Denver',
  description: 'Expert home improvement tips and advice from Denver\'s top contractors.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientNavigation />
      <Header 
        title="Top Contractors Blog"
        subtitle="Expert insights and tips from Denver's leading contractors"
      />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
