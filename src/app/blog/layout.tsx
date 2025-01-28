import { Metadata } from 'next';

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
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
