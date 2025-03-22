import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}
