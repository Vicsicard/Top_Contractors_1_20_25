const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('../src/utils/ghost');

// Function to extract category from post HTML
function extractCategory(html) {
    if (!html) return null;
    const match = html.match(/<a[^>]*href="\/trades\/([^"]+)"[^>]*>/i);
    return match ? match[1] : null;
}

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
            byCategory: {},
            uncategorizedPosts: []
        };

        // Analyze each post
        for (const post of posts) {
            const category = extractCategory(post.html);
            
            if (category) {
                analysis.categorized++;
                analysis.byCategory[category] = (analysis.byCategory[category] || 0) + 1;
            } else {
                analysis.uncategorized++;
                analysis.uncategorizedPosts.push({
                    title: post.title,
                    slug: post.slug,
                    url: `https://topcontractorsdenver.com/blog/${post.slug}`
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
            `- Categorized Posts: ${analysis.categorized}`,
            `- Uncategorized Posts: ${analysis.uncategorized}`,
            '',
            '## Category Distribution',
            ...Object.entries(analysis.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => 
                    `- ${category}: ${count} posts`
                ),
            '',
            '## Uncategorized Posts',
            'These posts need attention:',
            '',
            ...analysis.uncategorizedPosts.map(post => 
                `- [${post.title}](${post.url})`
            )
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
