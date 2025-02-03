import { scriptSupabase } from '../src/utils/script-supabase';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  content: {
    html: string;
  };
  brief: string;
  coverImage: {
    url: string;
  } | null;
  publishedAt: string;
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

interface HashnodeResponse {
  data: {
    me: {
      publications: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            posts: {
              edges: Array<{
                node: HashnodePost;
              }>;
            };
          };
        }>;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

async function syncHashnodePosts() {
  try {
    console.log('Starting Hashnode sync...');
    
    // 1. Fetch posts from Hashnode
    console.log('Fetching posts from Hashnode...');
    const response = await fetch(HASHNODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HASHNODE_API_KEY}`,
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              publications(first: 10) {
                edges {
                  node {
                    id
                    title
                    posts(first: 50) {
                      edges {
                        node {
                          id
                          title
                          content {
                            html
                          }
                          brief
                          slug
                          coverImage {
                            url
                          }
                          publishedAt
                          tags {
                            name
                            slug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
      }),
    });

    const result: HashnodeResponse = await response.json();
    
    if (result.errors) {
      throw new Error(`Hashnode API Error: ${result.errors[0].message}`);
    }
    
    if (!result.data?.me?.publications?.edges?.length) {
      throw new Error('No publications found');
    }

    const publication = result.data.me.publications.edges[0].node;
    console.log(`Found publication: ${publication.title}`);

    if (!publication.posts?.edges?.length) {
      throw new Error('No posts found in publication');
    }

    const posts = publication.posts.edges.map(edge => ({
      hashnode_id: edge.node.id,
      title: edge.node.title,
      slug: edge.node.slug,
      content: edge.node.content.html,
      brief: edge.node.brief,
      cover_image: edge.node.coverImage?.url || null,
      published_at: new Date(edge.node.publishedAt).toISOString(),
      tags: edge.node.tags.map(t => t.name),
      updated_at: new Date().toISOString()
    }));

    console.log(`Found ${posts.length} posts to sync`);

    // 2. Sync posts to Supabase
    console.log('\nSyncing posts to Supabase...');
    for (const post of posts) {
      const { error } = await scriptSupabase
        .from('posts')
        .upsert(
          {
            ...post,
            hashnode_id: post.hashnode_id
          },
          {
            onConflict: 'hashnode_id'
          }
        );

      if (error) {
        console.error(`Error syncing post ${post.title}:`, error);
      } else {
        console.log(`Synced post: ${post.title}`);
      }
    }

    console.log('\nSync completed successfully! ✅');

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

syncHashnodePosts();
