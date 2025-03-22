import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'isomorphic-dompurify';

// Custom plugin to handle code blocks with language
function customCodePlugin() {
  return function transformer(tree: any) {
    const visit = (node: any) => {
      if (node.type === 'code') {
        // Add language class for Prism.js
        node.data = node.data || {};
        node.data.hProperties = {
          className: `language-${node.lang || 'text'}`,
          ...node.data.hProperties
        };
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

// Custom plugin to handle images
function imageProcessor() {
  return function transformer(tree: any) {
    const visit = (node: any) => {
      if (node.type === 'image') {
        // Convert markdown image to responsive image with lazy loading
        node.type = 'html';
        node.value = `
          <div class="relative w-full aspect-video my-8">
            <img
              src="${node.url}"
              alt="${node.alt || ''}"
              class="rounded-lg shadow-lg w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        `;
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

const processor = unified()
  .use(remarkParse) // Parse markdown
  .use(remarkGfm) // Support GFM (tables, strikethrough, etc.)
  .use(customCodePlugin) // Add language classes to code blocks
  .use(imageProcessor) // Handle images with responsive design
  .use(remarkHtml, { 
    sanitize: true // Enable built-in sanitization
  });

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // Process markdown to HTML
    const result = await processor.process(markdown);
    const html = result.toString();

    // Additional sanitization with DOMPurify
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['div', 'img'], // Allow div and img tags for responsive images
      ADD_ATTR: [
        'class', 
        'src', 
        'alt', 
        'loading'
      ], // Allow necessary attributes for images and syntax highlighting
    });
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return ''; // Return empty string on error
  }
}
