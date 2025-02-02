import { HashnodeScriptClient } from './hashnode-script-client';
import { TRADE_CATEGORIES } from '../src/lib/hashnode/utils';

// Initialize Hashnode client
const apiKey = process.env.HASHNODE_API_KEY || '';
const host = 'top-contractors-denver.hashnode.dev';
const client = new HashnodeScriptClient(apiKey, host);

interface PostTag {
  name: string;
  slug: string;
}

interface PostNode {
  title: string;
  slug: string;
  tags: PostTag[];
}

interface PostEdge {
  node: PostNode;
}

interface PostsResponse {
  edges: PostEdge[];
}

async function checkTags() {
  try {
    // Get all posts
    const posts = await client.getPosts(10) as PostsResponse;
    
    console.log('\nChecking post tags...\n');
    
    posts.edges.forEach(({ node: post }) => {
      console.log(`Post: ${post.title}`);
      console.log(`URL: ${host}/${post.slug}`);
      console.log('Tags:', post.tags.map((tag: PostTag) => tag.slug).join(', '));
      
      // Check if post has any of our trade category tags
      const matchingTags = post.tags.filter((tag: PostTag) => 
        Object.values(TRADE_CATEGORIES).includes(tag.slug as any)
      );
      
      if (matchingTags.length === 0) {
        console.log('❌ No matching trade category tags found');
        console.log('Required tag for bathroom remodeling: bathroom-remodeling');
      } else {
        console.log('✅ Found matching trade category tags:', matchingTags.map((t: PostTag) => t.slug).join(', '));
      }
      console.log('\n---\n');
    });

  } catch (error) {
    console.error('Error checking tags:', error);
  }
}

// Run the check
checkTags();
