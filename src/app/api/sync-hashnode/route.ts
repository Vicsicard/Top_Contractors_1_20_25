import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const TRADE_CATEGORIES = [
  'bathroom remodeling',
  'bathroomremodeling',
  'decks',
  'electrician',
  'epoxy garage',
  'fencing',
  'flooring',
  'home remodeling',
  'homeremodeling',
  'hvac',
  'kitchen remodeling',
  'kitchenremodeling',
  'landscaper',
  'masonry',
  'plumbing',
  'roofer',
  'siding gutters',
  'sidinggutters',
  'windows'
];

// Tag variations that map to trade categories
const TAG_MAPPINGS = {
  'bathroom remodeling': ['bathroom', 'bathroomremodeling', 'bathroom remodeling', 'bath', 'bathroom renovation', 'batroom', 'bathroomredomeling'],
  'kitchen remodeling': ['kitchen', 'kitchenremodeling', 'kitchen remodeling', 'kitchen renovation'],
  'home remodeling': ['home remodeling', 'homeremodeling', 'renovation', 'remodeling', 'home improvement'],
  'epoxy garage': ['epoxy', 'garage', 'epoxy flooring', 'garage flooring'],
  'siding gutters': ['siding and gutters', 'gutters', 'siding', 'vinyl siding', 'vinylsiding', 'sidinggutters'],
  'hvac': ['hvac', 'heating', 'cooling', 'air conditioning'],
  'landscaper': ['landscaping', 'landscape', 'yard', 'outdoor'],
  'windows': ['window', 'windows', 'windowinstaller', 'windowinstallers'],
  'decks': ['deck', 'decks', 'deckcontractor', 'deckinstaller'],
  'roofer': ['roof', 'roofer', 'roofing', 'roofers'],
  'fencing': ['fence', 'fencing', 'fenceinstaller', 'fencecontractor'],
  'flooring': ['floor', 'flooring', 'floorinstaller', 'floorcontractor'],
  'electrician': ['electric', 'electrical', 'electrician', 'wiring'],
  'masonry': ['masonry', 'brick', 'stone', 'concrete'],
  'plumbing': ['plumbing', 'plumber', 'pipes', 'water']
};

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
    me?: {
      publications: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            posts: {
              pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
              };
              edges: Array<{
                node: {
                  id: string;
                  title: string;
                  slug: string;
                  content: {
                    html: string;
                  };
                  brief: string;
                  coverImage?: {
                    url: string;
                  };
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

function findTradeCategory(tags: string[]): string | null {
  // Convert tags to lowercase for comparison
  const normalizedTags = tags.map(tag => tag.toLowerCase().trim());
  
  // First check TAG_MAPPINGS for variations
  for (const [category, variations] of Object.entries(TAG_MAPPINGS)) {
    if (variations.some(variation => normalizedTags.includes(variation.toLowerCase()))) {
      console.log(`Found trade category match through variations: ${category}`);
      return category.toLowerCase().replace(/\s+/g, '-');
    }
  }

  // Then check for direct matches with trade categories
  const matchedCategory = TRADE_CATEGORIES.find(category => 
    normalizedTags.includes(category.toLowerCase())
  );
  
  if (matchedCategory) {
    console.log(`Found exact trade category match: ${matchedCategory}`);
    return matchedCategory.toLowerCase().replace(/\s+/g, '-');
  }

  // Check for partial matches in tags
  for (const tag of normalizedTags) {
    for (const category of TRADE_CATEGORIES) {
      if (tag.includes(category.toLowerCase()) || category.toLowerCase().includes(tag)) {
        console.log(`Found partial match: ${category} from tag: ${tag}`);
        return category.toLowerCase().replace(/\s+/g, '-');
      }
    }
  }
  
  console.log('No trade category match found for tags:', normalizedTags);
  return null;
}

export async function POST() {
  try {
    console.log('Starting Hashnode sync...');
    
    // Check environment variables
    console.log('Environment check:', {
      hashnodeApiKey: !!process.env.HASHNODE_API_KEY,
      hashnodePublicationId: !!process.env.HASHNODE_PUBLICATION_ID,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 1. Get existing post IDs from Supabase
    console.log('Fetching existing post IDs from Supabase...');
    const { data: existingPosts, error: fetchError } = await supabase
      .from('posts')
      .select('hashnode_id')
      .not('hashnode_id', 'is', null);

    if (fetchError) {
      throw new Error(`Failed to fetch existing posts: ${fetchError.message}`);
    }

    const existingIds = new Set(existingPosts?.map(post => post.hashnode_id) || []);
    console.log(`Found ${existingIds.size} existing posts in database`);
    
    // 2. Fetch posts from Hashnode using pagination
    console.log('Fetching posts from Hashnode...');
    let hasNextPage = true;
    let cursor = null;
    let allPosts: HashnodePost[] = [];
    
    // Track sync statistics
    const stats = {
      totalPosts: 0,
      postsWithTags: 0,
      postsWithTradeCategory: 0,
      uniqueTags: new Set<string>(),
      categories: new Set<string>()
    };

    while (hasNextPage) {
      const response = await fetch(HASHNODE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HASHNODE_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            query($cursor: String) {
              me {
                publications(first: 10) {
                  edges {
                    node {
                      id
                      title
                      posts(first: 50, after: $cursor) {
                        pageInfo {
                          hasNextPage
                          endCursor
                        }
                        edges {
                          node {
                            id
                            title
                            slug
                            content {
                              html
                            }
                            brief
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
          `,
          variables: {
            cursor: cursor
          }
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
        break;
      }

      const pagePosts: HashnodePost[] = publication.posts.edges.map(edge => ({
        hashnode_id: edge.node.id,
        title: edge.node.title,
        slug: edge.node.slug,
        excerpt: edge.node.brief,
        content: edge.node.content.html,
        cover_image: edge.node.coverImage?.url || null,
        published_at: edge.node.publishedAt,
        tags: edge.node.tags.map(tag => tag.name)
      }));

      // Filter out existing posts and only keep new ones
      const newPosts = pagePosts.filter(post => !existingIds.has(post.hashnode_id));
      
      console.log(`Found ${newPosts.length} new posts in this batch`);
      
      allPosts = [...allPosts, ...newPosts];
      
      // Update statistics for new posts
      newPosts.forEach(post => {
        if (post.tags && post.tags.length > 0) {
          stats.postsWithTags++;
          post.tags.forEach(tag => stats.uniqueTags.add(tag));
        }
      });
      
      // Update pagination info
      hasNextPage = publication.posts.pageInfo.hasNextPage;
      cursor = publication.posts.pageInfo.endCursor;
      
      console.log(`Fetched ${pagePosts.length} posts, ${newPosts.length} are new. Has more: ${hasNextPage}`);
    }

    stats.totalPosts = allPosts.length;
    console.log('\nSync Statistics:', {
      existingPosts: existingIds.size,
      newPosts: stats.totalPosts,
      postsWithTags: stats.postsWithTags,
      uniqueTags: Array.from(stats.uniqueTags),
    });
    console.log(`Found ${allPosts.length} new posts to sync`);

    // 3. Sync new posts to Supabase
    console.log('\nSyncing posts to Supabase...');
    for (const post of allPosts) {
      const tradeCategory = post.tags ? findTradeCategory(post.tags) : null;
      if (tradeCategory) {
        stats.postsWithTradeCategory++;
        stats.categories.add(tradeCategory);
      }
      console.log(`Post "${post.title}" - Category: ${tradeCategory || 'None'} - Tags: ${post.tags?.join(', ') || 'None'}`);

      const { error } = await supabase
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

    return NextResponse.json({ 
      success: true,
      stats: {
        totalPosts: stats.totalPosts,
        postsWithTags: stats.postsWithTags,
        postsWithTradeCategory: stats.postsWithTradeCategory,
        categories: Array.from(stats.categories),
        uniqueTags: Array.from(stats.uniqueTags)
      }
    });

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
