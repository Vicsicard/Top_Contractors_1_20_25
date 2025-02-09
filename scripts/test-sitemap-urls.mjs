import fetch from 'node-fetch';
import fs from 'fs';
import { parseString } from 'xml2js';

const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf-8');

async function testUrls() {
    parseString(sitemapContent, async (err, result) => {
        if (err) {
            console.error('Error parsing sitemap:', err);
            return;
        }

        const urls = result.urlset.url.map(url => url.loc[0]);
        console.log(`Total URLs in sitemap: ${urls.length}`);

        // Test first 10 URLs
        for (let i = 0; i < 10; i++) {
            const url = urls[i];
            try {
                const response = await fetch(url);
                console.log(`${url}: ${response.status}`);
            } catch (error) {
                console.error(`Error fetching ${url}:`, error.message);
            }
            // Small delay to not overwhelm the server
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Test some random blog posts
        const blogUrls = urls.filter(url => url.includes('/blog/'));
        console.log(`\nTotal blog URLs: ${blogUrls.length}`);
        
        for (let i = 0; i < 5; i++) {
            const url = blogUrls[Math.floor(Math.random() * blogUrls.length)];
            try {
                const response = await fetch(url);
                console.log(`${url}: ${response.status}`);
            } catch (error) {
                console.error(`Error fetching ${url}:`, error.message);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });
}

testUrls().catch(console.error);
