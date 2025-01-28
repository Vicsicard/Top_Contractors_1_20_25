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
        // Create a new JSDOM instance for server-side sanitization
        const window = new JSDOM('').window;
        
        // Sanitize the HTML using DOMPurify
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
                const url = new URL(link.href);
                if (url.host !== 'topcontractorsdenver.com') {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            } catch (e) {
                // Invalid URL, skip processing this link
            }
        });

        // Add responsive classes to images
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('w-full', 'h-auto', 'rounded-lg');
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
