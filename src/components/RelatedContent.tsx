import Link from 'next/link';

interface RelatedItem {
  title: string;
  href: string;
  description?: string;
  date?: string;
  type: 'blog' | 'trade' | 'video';
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
}

export function RelatedContent({ items, title = 'Related Content' }: RelatedContentProps) {
  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              {item.type === 'blog' && (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
              )}
              {item.type === 'trade' && (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
              {item.type === 'video' && (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-accent-warm">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-gray-600">{item.description}</p>
                )}
                {item.date && (
                  <time dateTime={item.date} className="mt-1 text-sm text-gray-500">
                    {item.date}
                  </time>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
