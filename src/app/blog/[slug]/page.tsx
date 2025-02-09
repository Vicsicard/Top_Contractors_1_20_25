import { getPostBySlug } from '@/utils/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRelatedPosts } from '@/utils/related-content';
import { PostContent } from '@/components/blog/PostContent';
import RelatedContent from '@/components/RelatedContent';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Top Contractors Denver`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on Top Contractors Denver`,
      images: post.feature_image ? [{ url: post.feature_image }] : []
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}`, current: true }
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <article className="prose prose-lg max-w-none mt-8">
        <PostContent post={post} />
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <RelatedContent
                key={relatedPost.id}
                post={relatedPost}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
