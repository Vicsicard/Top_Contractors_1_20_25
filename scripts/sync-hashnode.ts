import { scriptSupabase } from '../src/utils/script-supabase';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

interface HashnodePost {
  hashnode_id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string | null;
  published_at: string | null;
  tags: string[] | null;
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
                node: {
                  id: string;
                  title: string;
                  slug: string;
                  brief: string;
                  content: {
                    html: string;
                  };
                  coverImage?: {
                    url: string;
                  };
                  publishedAt: string;
                  tags: Array<{
                    name: string;
                  }>;
                };
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
                          slug
                          brief
                          content {
                            html
                          }
                          coverImage {
                            url
                          }
                          publishedAt
                          tags {
                            name
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

    const posts: HashnodePost[] = publication.posts.edges.map(edge => ({
      hashnode_id: edge.node.id,
      title: edge.node.title,
      slug: edge.node.slug,
      excerpt: edge.node.brief,
      content: edge.node.content.html,
      cover_image: edge.node.coverImage?.url || null,
      published_at: edge.node.publishedAt,
      tags: edge.node.tags.map(tag => tag.name)
    }));

    console.log(`Found ${posts.length} posts to sync`);

    // 2. Sync posts to Supabase
    console.log('\nSyncing posts to Supabase...');
    for (const post of posts) {
      const { error } = await scriptSupabase
        .from('posts')
        .upsert(
          {
            hashnode_id: post.hashnode_id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            html: post.content,
            feature_image: post.cover_image,
            published_at: post.published_at,
            tags: post.tags ? post.tags.map(tag => ({
              id: `hashnode_tag_${tag.toLowerCase().replace(/\s+/g, '_')}`,
              name: tag,
              slug: tag.toLowerCase().replace(/\s+/g, '-'),
              description: null
            })) : [],
            authors: [{
              id: 'default',
              name: 'Top Contractors Denver',
              slug: 'top-contractors-denver',
              profile_image: null,
              bio: null,
              url: null
            }],
            updated_at: new Date().toISOString()
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
