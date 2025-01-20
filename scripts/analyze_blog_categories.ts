const { getAllPosts } = require('../src/utils/ghost');
const { tradesData } = require('../src/lib/trades-data');
const fs = require('fs');
const path = require('path');

type TradeCategory = keyof typeof tradesData;

interface CategoryAnalysis {
    total: number;
    categorized: number;
    uncategorized: number;
    byCategory: { [key in TradeCategory]?: number };
    uncategorizedPosts: Array<{
        title: string;
        slug: string;
        url: string;
    }>;
}

async function analyzeBlogCategories() {
    console.log('Starting blog category analysis...');
    
    // Get all posts
    const posts = await getAllPosts();
    console.log(`Found ${posts.length} total posts`);

    const analysis: CategoryAnalysis = {
        total: posts.length,
        categorized: 0,
        uncategorized: 0,
        byCategory: {},
        uncategorizedPosts: []
    };

    // Initialize category counts
    (Object.keys(tradesData) as TradeCategory[]).forEach(category => {
        analysis.byCategory[category] = 0;
    });

    // Analyze each post
    for (const post of posts) {
        const categoryMatch = post.html?.match(/<a[^>]*href="\/trades\/([^"]+)"[^>]*>/i);
        const categoryId = categoryMatch?.[1] as TradeCategory | undefined;
        
        if (categoryId && categoryId in tradesData) {
            analysis.byCategory[categoryId] = (analysis.byCategory[categoryId] || 0) + 1;
            analysis.categorized++;
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
            .sort(([, a], [, b]) => (b || 0) - (a || 0))
            .map(([category, count]) => 
                `- ${tradesData[category as TradeCategory].title}: ${count} posts`
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

    console.log(`Analysis complete! Report saved to: ${reportPath}`);
    
    // Log summary to console
    console.log('\nQuick Summary:');
    console.log(`Total Posts: ${analysis.total}`);
    console.log(`Categorized: ${analysis.categorized} (${(analysis.categorized/analysis.total*100).toFixed(1)}%)`);
    console.log(`Uncategorized: ${analysis.uncategorized} (${(analysis.uncategorized/analysis.total*100).toFixed(1)}%)`);
    
    return analysis;
}

// Run the analysis if this script is executed directly
if (require.main === module) {
    analyzeBlogCategories().catch(console.error);
}

module.exports = analyzeBlogCategories;
