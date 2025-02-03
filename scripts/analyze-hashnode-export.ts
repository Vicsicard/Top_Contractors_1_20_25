import * as fs from 'fs';
import * as path from 'path';
import * as JSONStream from 'jsonstream';

const analyzeHashnodeExport = async (filePath: string) => {
  // Ensure file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log('Starting analysis of Hashnode export file...');
  console.log('This may take a moment for large files...\n');

  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const parser = JSONStream.parse('posts.*');
  
  let totalPosts = 0;
  let totalComments = 0;
  const categories = new Set<string>();
  const tags = new Set<string>();
  const structure: Record<string, Set<string>> = {};
  const titles: string[] = [];
  const dates: Date[] = [];
  const contentLengths: number[] = [];
  const tagNames: Set<string> = new Set();
  const topics: Map<string, number> = new Map();

  // Process the JSON stream
  fileStream.pipe(parser)
    .on('data', (data: any) => {
      // Analyze the structure of the first object
      if (totalPosts === 0) {
        console.log('\nDocument Structure:');
        analyzeStructure(data, structure);
        console.log(formatStructure(structure));
      }

      totalPosts++;
      
      // Store title, date, and content length
      if (data.title) {
        titles.push(data.title);
        // Analyze title for topic categorization
        const titleLower = data.title.toLowerCase();
        const topicKeywords = {
          'bathroom': ['bathroom', 'shower', 'bathtub', 'tub', 'sink', 'toilet'],
          'remodeling': ['remodel', 'renovation', 'upgrade', 'install', 'installation'],
          'maintenance': ['maintenance', 'repair', 'fix', 'prevent', 'clean'],
          'design': ['design', 'style', 'custom', 'modern', 'traditional'],
          'cost': ['cost', 'price', 'budget', 'expensive', 'affordable']
        };

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
          if (keywords.some(keyword => titleLower.includes(keyword))) {
            topics.set(topic, (topics.get(topic) || 0) + 1);
          }
        }
      }
      if (data.dateAdded) {
        dates.push(new Date(data.dateAdded));
      }
      if (data.content) {
        contentLengths.push(data.content.length);
      }

      // Count categories and tags if they exist
      if (data.categories) {
        data.categories.forEach((cat: string) => categories.add(cat));
      }
      if (data.tags) {
        data.tags.forEach((tag: any) => {
          tags.add(tag.id || tag);
          if (tag.name) tagNames.add(tag.name);
          else if (tag.slug) tagNames.add(tag.slug);
        });
      }
      if (data.comments) {
        totalComments += data.comments.length;
      }

      // Show progress every 100 posts
      if (totalPosts % 100 === 0) {
        process.stdout.write(`Processed ${totalPosts} posts...\r`);
      }
    })
    .on('end', () => {
      console.log('\n\nAnalysis Complete!');
      console.log('=================');
      console.log(`Total Posts: ${totalPosts}`);
      console.log(`Total Comments: ${totalComments}`);
      console.log(`Unique Categories: ${categories.size}`);
      console.log(`Unique Tags: ${tags.size}`);
      
      // Calculate date range
      if (dates.length > 0) {
        const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
        console.log(`\nDate Range: ${oldestDate.toLocaleDateString()} to ${newestDate.toLocaleDateString()}`);
      }

      // Calculate content statistics
      if (contentLengths.length > 0) {
        const avgLength = Math.round(contentLengths.reduce((a, b) => a + b, 0) / contentLengths.length);
        const minLength = Math.min(...contentLengths);
        const maxLength = Math.max(...contentLengths);
        console.log(`\nContent Statistics:`);
        console.log(`Average Length: ${avgLength} characters`);
        console.log(`Min Length: ${minLength} characters`);
        console.log(`Max Length: ${maxLength} characters`);
      }
      
      if (titles.length > 0) {
        console.log('\nMost Recent Posts:');
        const sortedPosts = titles.slice(0, 5).map((title, i) => {
          const date = dates[i] ? dates[i].toLocaleDateString() : 'No date';
          return `${date}: ${title}`;
        });
        console.log(sortedPosts.join('\n'));
      }
      
      if (categories.size > 0) {
        console.log('\nCategories:');
        console.log(Array.from(categories).join(', '));
      }
      
      if (tagNames.size > 0) {
        console.log('\nTag Names:');
        console.log(Array.from(tagNames).join(', '));
      }

      if (topics.size > 0) {
        console.log('\nContent Topics:');
        const sortedTopics = Array.from(topics.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([topic, count]) => `${topic}: ${count} posts (${Math.round(count/totalPosts*100)}%)`);
        console.log(sortedTopics.join('\n'));
      }
    })
    .on('error', (err: Error) => {
      console.error('Error processing file:', err);
      process.exit(1);
    });
};

function analyzeStructure(obj: any, structure: Record<string, Set<string>>, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      if (!structure[fullPath]) {
        structure[fullPath] = new Set();
      }
      structure[fullPath].add(typeof value);
      
      if (!Array.isArray(value)) {
        analyzeStructure(value, structure, fullPath);
      }
    } else {
      if (!structure[prefix]) {
        structure[prefix] = new Set();
      }
      structure[prefix].add(typeof value);
    }
  }
}

function formatStructure(structure: Record<string, Set<string>>): string {
  let result = '';
  for (const [path, types] of Object.entries(structure)) {
    result += `${path}: ${Array.from(types).join(', ')}\n`;
  }
  return result;
}

// Get the file path from command line or use default
const filePath = process.argv[2] || path.join(process.cwd(), 'hashnode-export-2-3-25.json.json');

// Run the analysis
analyzeHashnodeExport(filePath)
  .catch(error => {
    console.error('Failed to analyze file:', error);
    process.exit(1);
  });
