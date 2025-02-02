import fetch from 'node-fetch';
import { TRADE_CATEGORIES } from '../src/lib/hashnode/utils';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const apiKey = process.env.HASHNODE_API_KEY || '';
const host = 'top-contractors-denver.hashnode.dev';

interface Tag {
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  tags: Tag[];
}

interface PostEdge {
  node: Post;
}

interface PostsResponse {
  data?: {
    publication?: {
      posts?: {
        edges: PostEdge[];
      };
    };
  };
}

async function getPostsByTag(tag: string): Promise<PostEdge[]> {
  const query = `
    query GetPostsByTag($host: String!, $tag: String!) {
      publication(host: $host) {
        posts(first: 10, filter: { tagSlugs: [$tag] }) {
          edges {
            node {
              id
              title
              slug
              tags {
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(HASHNODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        host,
        tag: tag,
      },
    }),
  });

  const result = await response.json() as PostsResponse;
  return result.data?.publication?.posts?.edges || [];
}

async function verifyRoutes() {
  try {
    console.log('Verifying blog trade routes...\n');
    
    // Check bathroom remodeling posts
    const tag = 'bathroom-remodeling';
    const posts = await getPostsByTag(tag);
    
    console.log(`Found ${posts.length} posts for category: ${tag}`);
    
    posts.forEach(({ node: post }: PostEdge) => {
      console.log(`\nPost: ${post.title}`);
      console.log(`URL: /blog/trades/${tag}/${post.slug}`);
      console.log('Tags:', post.tags.map((t: Tag) => t.slug).join(', '));
    });

  } catch (error) {
    console.error('Error verifying routes:', error);
  }
}

// Run the verification
verifyRoutes();
