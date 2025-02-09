import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/blog';

interface Props {
  post: Post;
}

export default function RelatedContent({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="relative aspect-[16/9] mb-3">
        {post.feature_image && (
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover rounded-lg"
          />
        )}
      </div>
      <h3 className="text-lg font-semibold group-hover:text-blue-600 mb-2">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
      )}
    </Link>
  );
}
