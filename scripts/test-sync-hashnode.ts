import { scriptSupabase } from '../src/utils/script-supabase';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

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

interface Post {
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
}

async function testSyncHashnode() {
  try {
    // Verify environment variables
    if (!process.env.HASHNODE_API_KEY) {
      throw new Error('HASHNODE_API_KEY is not set');
    }
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error('Supabase environment variables are not set');
    }

    console.log('Starting Hashnode sync test...');
    
    // 1. Test Hashnode API connection
    console.log('Testing Hashnode API connection...');
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
                    posts(first: 10) {
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
    console.log('Hashnode API Response:', JSON.stringify(result, null, 2));
    
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
      title: edge.node.title,
      slug: edge.node.slug,
      content: edge.node.content.html,
      coverImage: edge.node.coverImage?.url || null,
      brief: edge.node.brief,
      publishedAt: edge.node.publishedAt,
      tags: edge.node.tags
    }));

    console.log('Successfully connected to Hashnode API');
    console.log(`Found ${posts.length} posts`);

    // 2. Test processing first post
    if (posts.length > 0) {
      const testPost = posts[0];
      console.log('\nTesting post processing with first post:');
      console.log(`Title: ${testPost.title}`);
      console.log(`Slug: ${testPost.slug}`);
      console.log(`Content length: ${testPost.content.length} characters`);
      console.log(`Has feature image: ${Boolean(testPost.coverImage)}`);
      console.log(`Tags: ${testPost.tags.map(t => t.name).join(', ')}`);
      console.log(`Published at: ${testPost.publishedAt}`);
    }

    // 3. Test Supabase connection
    console.log('\nTesting Supabase connection...');
    const { data, error } = await scriptSupabase
      .from('posts')
      .select('count')
      .limit(1);

    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    console.log('Successfully connected to Supabase');

    console.log('\nAll tests passed successfully! ✅');
    console.log('The sync process is ready to run.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testSyncHashnode();
