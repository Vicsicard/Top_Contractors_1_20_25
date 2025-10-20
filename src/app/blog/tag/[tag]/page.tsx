import { Metadata } from 'next';
import { getPostsByTag } from '@/utils/posts';
import { BlogPostGrid } from '@/components/blog/BlogPostGrid';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';

interface Props {
  params: {
    tag: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} - Blog | Top Contractors Denver`,
    description: `Read articles about ${tag} from Top Contractors Denver.`,
    alternates: {
      canonical: `/blog/tag/${params.tag}/`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

const POSTS_PER_PAGE = 12;

export default async function TagPage({ params, searchParams }: Props) {
  const tag = decodeURIComponent(params.tag);
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { posts, totalPosts } = await getPostsByTag(tag, currentPage, POSTS_PER_PAGE);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: `Tag: ${tag}`, href: `/blog/tag/${params.tag}`, current: true }
  ];

  if (!posts || posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="text-center mt-12">
          <h1 className="text-3xl font-bold mb-4">No Posts Found</h1>
          <p className="text-gray-600">No posts found with tag &ldquo;{tag}&rdquo;.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbs} />
      
      <h1 className="text-4xl font-bold mb-8">Posts Tagged &ldquo;{tag}&rdquo;</h1>
      
      <BlogPostGrid 
        posts={posts} 
        currentPage={currentPage}
        totalPosts={totalPosts}
        postsPerPage={POSTS_PER_PAGE}
      />
    </main>
  );
}
