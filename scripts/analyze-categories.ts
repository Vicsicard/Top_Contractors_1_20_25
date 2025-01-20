import { getAllPosts, setGhostConfig, extractPostCategory } from '../src/utils/ghost';
import { tradesData } from '../src/lib/trades-data';
import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Polyfill fetch for Node.js environment
import fetch from 'node-fetch';
if (!globalThis.fetch) {
    (globalThis as any).fetch = fetch;
}

// Set environment variables from command line arguments
const argv = yargs(hideBin(process.argv))
  .options({
    ghostUrl: {
      type: 'string',
      demandOption: true,
      describe: 'Ghost URL'
    },
    ghostOrgContentApiKey: {
      type: 'string',
      demandOption: true,
      describe: 'Ghost Org Content API Key'
    },
    oldGhostUrl: {
      type: 'string',
      demandOption: true,
      describe: 'Old Ghost URL'
    },
    oldGhostOrgContentApiKey: {
      type: 'string',
      demandOption: true,
      describe: 'Old Ghost Org Content API Key'
    },
    nodeEnv: {
      type: 'string',
      default: 'development',
      describe: 'Node Environment'
    }
  })
  .parseSync();

// Set Ghost configuration
setGhostConfig({
    newGhostUrl: argv.ghostUrl,
    newGhostKey: argv.ghostOrgContentApiKey
});

process.env.NODE_ENV = argv.nodeEnv;

async function analyzeCategories() {
    console.log('Starting blog category analysis...');
    
    try {
        // Get all posts
        const posts = await getAllPosts();
        console.log(`Found ${posts.length} total posts`);

        // Initialize analysis data
        const analysis = {
            total: posts.length,
            categorized: 0,
            uncategorized: 0,
            byCategory: {} as Record<string, number>,
            uncategorizedPosts: [] as Array<{
                title: string;
                slug: string;
                url: string;
                html?: string;
            }>
        };

        // Initialize category counts with trade categories
        Object.keys(tradesData).forEach(category => {
            analysis.byCategory[category] = 0;
        });

        // Analyze each post
        for (const post of posts) {
            const category = extractPostCategory(post);
            
            if (category && category in tradesData) {
                analysis.categorized++;
                analysis.byCategory[category]++;
            } else {
                analysis.uncategorized++;
                analysis.uncategorizedPosts.push({
                    title: post.title,
                    slug: post.slug,
                    url: `https://topcontractorsdenver.com/blog/${post.slug}`,
                    html: post.html // Include HTML for manual inspection
                });
            }
        }

        // Generate report
        const report = [
            '# Blog Category Analysis Report',
            `Generated on: ${new Date().toLocaleString()}`,
            '',
            '## Summary',
            `- Total Posts: ${analysis.total}`,
            `- Categorized Posts: ${analysis.categorized} (${(analysis.categorized/analysis.total*100).toFixed(1)}%)`,
            `- Uncategorized Posts: ${analysis.uncategorized} (${(analysis.uncategorized/analysis.total*100).toFixed(1)}%)`,
            '',
            '## Category Distribution',
            ...Object.entries(analysis.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => 
                    `- ${tradesData[category as keyof typeof tradesData].title}: ${count} posts`
                ),
            '',
            '## Uncategorized Posts',
            'These posts need attention:',
            '',
            ...analysis.uncategorizedPosts.map(post => 
                `- [${post.title}](${post.url})`
            ),
            '',
            '## Detailed Analysis of Uncategorized Posts',
            'Here are the first few paragraphs of each uncategorized post to help identify the appropriate category:',
            '',
            ...analysis.uncategorizedPosts.map(post => [
                `### ${post.title}`,
                `URL: ${post.url}`,
                'Content Preview:',
                '```html',
                post.html?.substring(0, 500) + '...',
                '```',
                ''
            ]).flat()
        ].join('\n');

        // Save report
        const reportPath = path.join(process.cwd(), 'reports', 'blog_category_analysis.md');
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, report);

        console.log(`\nAnalysis complete! Report saved to: ${reportPath}`);
        
        // Log summary to console
        console.log('\nQuick Summary:');
        console.log(`Total Posts: ${analysis.total}`);
        console.log(`Categorized: ${analysis.categorized} (${(analysis.categorized/analysis.total*100).toFixed(1)}%)`);
        console.log(`Uncategorized: ${analysis.uncategorized} (${(analysis.uncategorized/analysis.total*100).toFixed(1)}%)`);
        
    } catch (error) {
        console.error('Error during analysis:', error);
    }
}

// Run the analysis
analyzeCategories();
