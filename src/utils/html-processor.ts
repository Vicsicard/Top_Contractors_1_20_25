import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import { Config } from 'dompurify';

// Configure DOMPurify options
const purifyOptions: Config = {
    ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'ul', 'ol', 'li',
        'b', 'strong', 'i', 'em',
        'a', 'img',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
    ],
    ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title',
        'class', 'id',
        'width', 'height'
    ],
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: ['iframe'], // Allow iframe for video embeds
    ADD_ATTR: ['allowfullscreen', 'frameborder'], // Attributes for iframes
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
};

export function sanitizeHtml(html: string | null): string {
    if (!html) return '';
    
    try {
        // Create a new JSDOM instance for server-side sanitization and sanitize the HTML using DOMPurify
        return DOMPurify.sanitize(html, {
            ...purifyOptions,
            RETURN_DOM: false,
            RETURN_DOM_FRAGMENT: false
        });
    } catch (error) {
        console.error('Error sanitizing HTML:', error);
        return '<p>Error processing content</p>';
    }
}

export function processHtml(html: string | null): string {
    if (!html) return '';
    
    try {
        // Sanitize the HTML first
        const sanitized = sanitizeHtml(html);
        
        // Create a new JSDOM instance for processing
        const dom = new JSDOM(sanitized);
        const { document } = dom.window;
        
        // Process external links
        document.querySelectorAll('a').forEach(link => {
            try {
                // Handle relative URLs
                const href = link.href;
                if (href.startsWith('/')) {
                    // Internal link, keep as is
                    return;
                }

                // Try to decode the URL if it's encoded
                let decodedUrl = href;
                try {
                    decodedUrl = decodeURIComponent(href);
                } catch (e) {
                    // If decoding fails, use the original URL
                    console.warn('Failed to decode URL:', href, e);
                }

                const url = new URL(decodedUrl);
                if (url.host !== 'topcontractorsdenver.com') {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
                } catch (error) {
                    // For invalid URLs, try to clean and encode
                    console.warn('Invalid URL, attempting cleanup:', error);
                try {
                    const cleanUrl = link.href
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-\:\/\?\=\&\#\.]/g, '');
                    link.href = cleanUrl;
                } catch (e) {
                    // If all attempts fail, remove the href
                    console.warn('Invalid URL, removing href:', link.href, e);
                    link.removeAttribute('href');
                }
            }
        });

        // Process images for Next.js compatibility
        document.querySelectorAll('img').forEach(img => {
            // Convert img to a BlogImage component placeholder
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            
            // Create a placeholder element
            const placeholder = document.createElement('blog-image');
            placeholder.setAttribute('data-src', src || '');
            placeholder.setAttribute('data-alt', alt);
            
            // Replace the img with our placeholder
            img.parentNode?.replaceChild(placeholder, img);
        });

        // Add styling to tables
        document.querySelectorAll('table').forEach(table => {
            table.classList.add('w-full', 'border-collapse', 'border', 'border-gray-300');
        });

        document.querySelectorAll('th, td').forEach(cell => {
            cell.classList.add('border', 'border-gray-300', 'p-2');
        });

        // Get the processed HTML
        const processedHtml = document.body.innerHTML;
        
        // Clean up JSDOM instance
        dom.window.close();
        
        return processedHtml;
    } catch (error) {
        console.error('Error processing HTML:', error);
        return '<p>Error processing content</p>';
    }
}

export function extractFirstImage(html: string): string | undefined {
    try {
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const firstImage = document.querySelector('img');
        return firstImage?.getAttribute('src') || undefined;
    } catch (error) {
        console.error('Error extracting first image:', error);
        return undefined;
    }
}
