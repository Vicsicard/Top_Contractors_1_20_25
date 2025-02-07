import React from 'react';

// Mock BlogPostCard component
export function BlogPostCard({ post }: any) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </article>
  );
}

// Mock CategoryList component
export function CategoryList({ activeCategory, categories }: any) {
  return (
    <div>
      {categories.map((category: any) => (
        <a
          key={category.id}
          href={`/blog/page/1?category=${category.id}`}
          className={activeCategory === category.id ? 'ring-2 ring-blue-500' : ''}
        >
          {category.title}
        </a>
      ))}
    </div>
  );
}

// Mock Pagination component
export function Pagination({ currentPage, totalPages, baseUrl }: any) {
  return (
    <nav>
      <ul>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <a href={`${baseUrl}/${page}`}>{page}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
