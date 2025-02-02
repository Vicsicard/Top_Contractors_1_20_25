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
  tags: Tag[];
}

interface PostEdge {
  node: Post;
}

interface UpdatedPost {
  post: Post;
}

async function updatePostTags(postId: string, tagName: string) {
  const query = `
    mutation UpdatePost($input: UpdatePostInput!) {
      updatePost(input: $input) {
        post {
          id
          title
          tags {
            name
            slug
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
        input: {
          id: postId,
          tags: [{
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }]
        },
      },
    }),
  });

  const result = await response.json();
  console.log('Update response:', JSON.stringify(result, null, 2));
  
  if (result.errors) {
    throw new Error(`Failed to update post tags: ${result.errors[0].message}`);
  }

  return result.data.updatePost as UpdatedPost;
}

async function getPostsToUpdate(): Promise<PostEdge[]> {
  const query = `
    query GetPosts($host: String!) {
      publication(host: $host) {
        posts(first: 10) {
          edges {
            node {
              id
              title
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
      },
    }),
  });

  const result = await response.json();
  console.log('Posts response:', JSON.stringify(result, null, 2));
  
  if (result.errors) {
    throw new Error(`Failed to fetch posts: ${result.errors[0].message}`);
  }

  return result.data.publication.posts.edges;
}

async function updateTags() {
  try {
    console.log('Fetching posts...');
    const posts = await getPostsToUpdate();

    for (const { node: post } of posts) {
      console.log(`\nChecking post: ${post.title}`);
      console.log('Current tags:', post.tags.map((t: Tag) => t.slug).join(', '));

      // For bathroom remodeling posts, update to correct tag
      const hasBathroomTag = post.tags.some((tag: Tag) => 
        tag.slug === 'bathroomremodeling' || 
        tag.slug === 'bathrom-remodeling'
      );

      if (hasBathroomTag) {
        console.log('Updating to correct bathroom-remodeling tag...');
        const updatedPost = await updatePostTags(post.id, 'Bathroom Remodeling');
        console.log('✅ Updated tags:', updatedPost.post.tags.map((t: Tag) => t.slug).join(', '));
      } else {
        console.log('No tag updates needed');
      }
    }

    console.log('\nTag update complete!');
  } catch (error) {
    console.error('Error updating tags:', error);
  }
}

// Run the update
updateTags();
