import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/utils/supabase-server';
import { getAllTrades, getAllSubregions } from '@/utils/database';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Site Map | Top Contractors Denver',
  description: 'Complete index of all pages on Top Contractors Denver. Find contractors, blog posts, videos, and service areas easily.',
  alternates: {
    canonical: '/sitemap',
  }
};

interface PageLink {
  title: string;
  href: string;
  description?: string;
}

export default async function SitemapPage() {
  const supabase = createClient();
  const trades = await getAllTrades();
  const subregions = await getAllSubregions();
  
  // Fetch recent blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, published_at')
    .order('published_at', { ascending: false })
    .limit(10);

  // Fetch recent videos
  const { data: videos } = await supabase
    .from('videos')
    .select('title, id, category, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  const mainPages: PageLink[] = [
    { title: 'Home', href: '/', description: 'Find top-rated contractors in Denver' },
    { title: 'Trades', href: '/trades', description: 'Browse all trade services' },
    { title: 'Blog', href: '/blog', description: 'Home improvement tips and guides' },
    { title: 'Videos', href: '/videos', description: 'Watch our contractor videos' },
    { title: 'About', href: '/about', description: 'Learn about Top Contractors Denver' },
    { title: 'Contact', href: '/contact', description: 'Get in touch with us' },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav
        items={[
          { label: 'Home', href: '/' },
          { label: 'Site Map', href: '/sitemap' }
        ]}
      />
      
      <h1 className="text-4xl font-bold mb-8">Site Map</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Pages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Main Pages</h2>
          <div className="space-y-4">
            {mainPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-primary">{page.title}</h3>
                {page.description && (
                  <p className="mt-1 text-gray-600">{page.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Trade Services */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Trade Services</h2>
          <div className="space-y-4">
            {trades.map((trade) => (
              <div key={trade.slug} className="p-4 bg-white rounded-lg shadow-sm">
                <Link
                  href={`/trades/${trade.slug}`}
                  className="block font-medium text-primary hover:text-accent-warm"
                >
                  {trade.category_name}
                </Link>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {subregions.slice(0, 4).map((subregion) => (
                    <Link
                      key={subregion.slug}
                      href={`/trades/${trade.slug}/${subregion.slug}`}
                      className="text-sm text-gray-600 hover:text-accent-warm"
                    >
                      {trade.category_name} in {subregion.subregion_name}
                    </Link>
                  ))}
                  {subregions.length > 4 && (
                    <span className="text-sm text-gray-500">
                      +{subregions.length - 4} more areas
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Blog Posts */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Blog Posts</h2>
          <div className="space-y-4">
            {posts?.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-primary">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
            <Link
              href="/blog"
              className="block text-accent-warm hover:text-accent-warm-dark font-medium"
            >
              View all blog posts →
            </Link>
          </div>
        </section>

        {/* Recent Videos */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Videos</h2>
          <div className="space-y-4">
            {videos?.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.category}/${video.id}`}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-primary">{video.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(video.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
            <Link
              href="/videos"
              className="block text-accent-warm hover:text-accent-warm-dark font-medium"
            >
              View all videos →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
