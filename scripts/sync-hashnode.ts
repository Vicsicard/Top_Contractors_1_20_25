import { scriptSupabase } from '../src/utils/script-supabase';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  content: {
    html: string;
  };
  brief?: string;
  coverImage?: {
    url: string;
  } | null;
  publishedAt: string;
  tags?: Array<{
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
              pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
              };
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
  console.log('Starting Hashnode sync...');
  let successCount = 0;
  let errorCount = 0;
  let updateCount = 0;
  let insertCount = 0;

  try {
    let allPosts: HashnodePost[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage) {
      console.log('Fetching posts from Hashnode...');
      console.log(endCursor ? `Using cursor: ${endCursor}` : 'First page');

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
                      posts(first: 50${endCursor ? `, after: "${endCursor}"` : ''}) {
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
                              slug
                            }
                          }
                        }
                        pageInfo {
                          hasNextPage
                          endCursor
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

      const publication = result.data.me.publications.edges[0]?.node;
      if (!publication) {
        throw new Error('No publication found');
      }

      const posts = publication.posts.edges.map(edge => edge.node);
      allPosts = allPosts.concat(posts);

      hasNextPage = publication.posts.pageInfo.hasNextPage;
      endCursor = publication.posts.pageInfo.endCursor;

      console.log(`Fetched ${posts.length} posts (Total: ${allPosts.length})`);
      
      if (hasNextPage) {
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Total posts fetched from Hashnode: ${allPosts.length}`);
    console.log('Starting Supabase sync...');

    // Process and store posts
    for (const post of allPosts) {
      try {
        const { data: existingPost, error: selectError } = await scriptSupabase
          .from('posts')
          .select('id')
          .eq('hashnode_id', post.id)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          console.error(`Error checking post existence: ${post.title}`, selectError);
          errorCount++;
          continue;
        }

        const postData = {
          hashnode_id: post.id,
          title: post.title,
          slug: post.slug,
          html: post.content.html,
          excerpt: post.brief || null,
          feature_image: post.coverImage?.url || null,
          feature_image_alt: null,
          authors: null,
          tags: post.tags?.map(tag => tag.name) || [],
          reading_time: null,
          trade_category: post.tags?.find((tag: { name: string }) => 
            tag.name.toLowerCase().startsWith('trade-')
          )?.name.toLowerCase().replace('trade-', '') || null,
          published_at: post.publishedAt,
          updated_at: new Date().toISOString(),
        };

        if (existingPost) {
          const { error: updateError } = await scriptSupabase
            .from('posts')
            .update(postData)
            .eq('hashnode_id', post.id);

          if (updateError) {
            console.error(`Error updating post: ${post.title}`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Updated post: ${post.title}`);
            updateCount++;
            successCount++;
          }
        } else {
          const { error: insertError } = await scriptSupabase
            .from('posts')
            .insert([postData]);

          if (insertError) {
            console.error(`Error inserting post: ${post.title}`, insertError);
            errorCount++;
          } else {
            console.log(`✅ Created new post: ${post.title}`);
            insertCount++;
            successCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing post: ${post.title}`, error);
        errorCount++;
      }
    }

    console.log('\nSync Summary:');
    console.log(`Total posts fetched from Hashnode: ${allPosts.length}`);
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Updates: ${updateCount}`);
    console.log(`Inserts: ${insertCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n⚠️ Some posts failed to sync. Please check the error messages above.');
    } else {
      console.log('\n✅ Sync completed successfully');
    }
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncHashnodePosts();
