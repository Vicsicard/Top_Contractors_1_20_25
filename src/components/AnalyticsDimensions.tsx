'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsDimensions() {
  const [dimensions, setDimensions] = useState('{}');

  useEffect(() => {
    const meta = document.querySelector('meta[name="analytics-dimensions"]');
    if (meta) {
      setDimensions(meta.getAttribute('content') || '{}');
    }
  }, []);

  return (
    <meta
      name="analytics-dimensions"
      content={dimensions}
    />
  );
}
