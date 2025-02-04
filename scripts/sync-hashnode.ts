import { scriptSupabase } from '../src/utils/script-supabase';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const TRADE_CATEGORIES = [
  'bathroom remodeling',
  'decks',
  'electrician',
  'epoxy garage',
  'fencing',
  'flooring',
  'home remodeling',
  'hvac',
  'kitchen remodeling',
  'landscaper',
  'masonry',
  'plumbing',
  'roofer',
  'siding gutters',
  'windows',
  'siding'  // Added to match vinyl siding posts
];

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
  data?: {
    user?: {
      publications?: {
        edges: Array<{
          node: {
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

interface PostEdge {
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
}

function findTradeCategory(tags: string[]): string | null {
  // Convert tags to lowercase for comparison
  const normalizedTags = tags.map(tag => tag.toLowerCase().trim());
  
  // Special case for bathroom remodeling
  if (normalizedTags.includes('bathroom') || 
      normalizedTags.includes('bathroomremodeling') ||
      normalizedTags.includes('bathroom remodeling')) {
    console.log('Found bathroom remodeling match');
    return 'bathroom remodeling';
  }

  // Direct match with our trade categories
  const matchedCategory = TRADE_CATEGORIES.find(category => 
    normalizedTags.includes(category.toLowerCase())
  );
  
  if (matchedCategory) {
    console.log(`Found exact trade category match: ${matchedCategory}`);
    return matchedCategory;
  }
  
  console.log('No trade category match found for tags:', normalizedTags);
  return null;
}

async function syncHashnodePosts() {
  try {
    console.log('Starting Hashnode sync...');
    
    // Check environment variables
    console.log('Environment check:', {
      hashnodeApiKey: !!process.env.HASHNODE_API_KEY,
      hashnodePublicationId: !!process.env.HASHNODE_PUBLICATION_ID,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    
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
            user(username: "topcontractorsdenver") {
              publications(first: 1) {
                edges {
                  node {
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
    
    if (!result.data?.user?.publications?.edges?.length) {
      throw new Error('Publication not found');
    }

    const publication = result.data.user.publications.edges[0].node;
    console.log('Found publication, checking for posts...');

    if (!publication.posts?.edges?.length) {
      throw new Error('No posts found in publication');
    }

    // Track sync statistics
    const stats = {
      totalPosts: publication.posts.edges.length,
      postsWithTags: 0,
      postsWithTradeCategory: 0,
      uniqueTags: new Set<string>(),
      categories: new Set<string>()
    };

    const posts: HashnodePost[] = publication.posts.edges.map((edge: PostEdge) => {
      // Track tag statistics
      if (edge.node.tags.length > 0) {
        stats.postsWithTags++;
        edge.node.tags.forEach(tag => stats.uniqueTags.add(tag.name));
      }

      return {
        hashnode_id: edge.node.id,
        title: edge.node.title,
        slug: edge.node.slug,
        excerpt: edge.node.brief,
        content: edge.node.content.html,
        cover_image: edge.node.coverImage?.url || null,
        published_at: edge.node.publishedAt,
        tags: edge.node.tags.map((tag: { name: string }) => tag.name)
      };
    });

    console.log('\nSync Statistics:', {
      totalPosts: stats.totalPosts,
      postsWithTags: stats.postsWithTags,
      uniqueTags: Array.from(stats.uniqueTags),
    });
    console.log(`Found ${posts.length} posts to sync`);

    // 2. Sync posts to Supabase
    console.log('\nSyncing posts to Supabase...');
    for (const post of posts) {
      const tradeCategory = post.tags ? findTradeCategory(post.tags) : null;
      if (tradeCategory) {
        stats.postsWithTradeCategory++;
        stats.categories.add(tradeCategory);
      }
      console.log(`Post "${post.title}" - Category: ${tradeCategory || 'None'} - Tags: ${post.tags?.join(', ') || 'None'}`);

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
            trade_category: tradeCategory,
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

    // Log final statistics
    console.log('\nFinal Sync Statistics:');
    console.log('---------------------');
    console.log(`Total Posts: ${stats.totalPosts}`);
    console.log(`Posts with Tags: ${stats.postsWithTags}`);
    console.log(`Posts with Trade Category: ${stats.postsWithTradeCategory}`);
    console.log('Trade Categories Found:', Array.from(stats.categories));
    console.log('All Unique Tags:', Array.from(stats.uniqueTags));
    console.log('\nSync completed successfully! ✅');

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

syncHashnodePosts();
