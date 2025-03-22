'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Add languages you need
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="!m-0 !bg-gray-900 !p-4 !rounded-lg">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
