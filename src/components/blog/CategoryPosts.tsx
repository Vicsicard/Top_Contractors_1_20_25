import { Post } from '@/types/blog';
import { PostCard } from './PostCard';

interface CategoryPostsProps {
  posts: Post[];
  title: string;
}

export default function CategoryPosts({ posts, title }: CategoryPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
