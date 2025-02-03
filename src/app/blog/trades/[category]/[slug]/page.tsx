import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/utils/posts';
import { isValidCategory, getStandardCategory } from '@/utils/category-mapper';
import { formatCategoryTitle, getCategoryMetadata } from '@/utils/category-utils';

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Validate category first
  if (!isValidCategory(params.category)) {
    return {
      title: 'Category Not Found | Top Contractors Denver Blog',
      description: 'The requested blog category could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  // Verify the post belongs to the correct category
  const standardCategory = getStandardCategory(post.trade_category);
  if (standardCategory !== params.category) {
    return {
      title: 'Post Not Found | Top Contractors Denver Blog',
      description: 'The requested blog post could not be found in this category.',
      robots: 'noindex, nofollow'
    };
  }

  return {
    title: `${post.title} | Top Contractors Denver Blog`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at,
      images: post.feature_image ? [post.feature_image] : undefined,
    },
    alternates: {
      canonical: `/blog/trades/${params.category}/${post.slug}`
    }
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function TradeBlogPost({ params }: Props) {
  // Validate category first
  if (!isValidCategory(params.category)) {
    notFound();
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Verify the post belongs to the correct category
  const standardCategory = getStandardCategory(post.trade_category);
  if (standardCategory !== params.category) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString()}
          </time>
          {post.reading_time && (
            <>
              <span className="mx-2">•</span>
              <span>{post.reading_time} min read</span>
            </>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.feature_image && (
        <div className="mb-8">
          <img
            src={post.feature_image}
            alt={post.feature_image_alt || `Featured image for ${post.title}`}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
