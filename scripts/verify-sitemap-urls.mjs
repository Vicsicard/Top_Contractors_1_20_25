import fs from 'fs';
import { parseString } from 'xml2js';
import fetch from 'node-fetch';

const sitemapPath = 'public/sitemap.xml';
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

async function checkUrl(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',  // Only get headers, not full content
            redirect: 'follow'
        });
        return {
            url,
            status: response.status,
            ok: response.ok
        };
    } catch (error) {
        return {
            url,
            status: 'error',
            error: error.message
        };
    }
}

async function verifySitemap() {
    console.log('Reading sitemap...');
    
    parseString(sitemapContent, async (err, result) => {
        if (err) {
            console.error('Error parsing sitemap:', err);
            return;
        }

        const urls = result.urlset.url.map(url => url.loc[0]);
        console.log(`Found ${urls.length} URLs in sitemap`);

        // Group URLs by type for better analysis
        const urlTypes = {
            static: urls.filter(url => !url.includes('/blog/') && !url.includes('/trades/') && !url.includes('/videos/')),
            blog: urls.filter(url => url.includes('/blog/')),
            trades: urls.filter(url => url.includes('/trades/')),
            videos: urls.filter(url => url.includes('/videos/'))
        };

        console.log('\nURL Distribution:');
        Object.entries(urlTypes).forEach(([type, urls]) => {
            console.log(`${type}: ${urls.length} URLs`);
        });

        // Test a sample of URLs from each type
        console.log('\nTesting sample URLs...');
        for (const [type, typeUrls] of Object.entries(urlTypes)) {
            console.log(`\nTesting ${type} URLs:`);
            const sampleSize = Math.min(5, typeUrls.length);
            const sampleUrls = typeUrls
                .sort(() => Math.random() - 0.5)  // Shuffle array
                .slice(0, sampleSize);

            const results = await Promise.all(sampleUrls.map(checkUrl));
            results.forEach(result => {
                if (result.ok) {
                    console.log(`✅ ${result.url} - ${result.status}`);
                } else {
                    console.log(`❌ ${result.url} - ${result.status}`);
                    if (result.error) {
                        console.log(`   Error: ${result.error}`);
                    }
                }
            });
        }
    });
}

verifySitemap().catch(console.error);
