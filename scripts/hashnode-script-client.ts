import fetch from 'node-fetch';

const HASHNODE_API_URL = 'https://gql.hashnode.com';

export class HashnodeScriptClient {
  private readonly apiKey: string;
  private readonly host: string;

  constructor(apiKey: string, host: string) {
    this.apiKey = apiKey;
    this.host = host;
  }

  private async fetchGraphQL(query: string, variables: Record<string, any> = {}) {
    console.log('Hashnode API Request:', {
      url: HASHNODE_API_URL,
      host: this.host,
      variables
    });
    const response = await fetch(HASHNODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    console.log('Hashnode API Response:', result);

    if (!response.ok || result.errors) {
      const errorMessage = result.errors?.[0]?.message || response.statusText;
      throw new Error(`Hashnode API error: ${errorMessage}`);
    }

    return result;
  }

  async getPosts(first: number = 10, after?: string) {
    const query = `
      query GetPosts($first: Int!, $after: String, $host: String!) {
        publication(host: $host) {
          posts(first: $first, after: $after) {
            edges {
              node {
                id
                title
                brief
                slug
                publishedAt
                coverImage {
                  url
                  isPortrait
                  isAttributionHidden
                }
                tags {
                  name
                  slug
                }
                author {
                  name
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
    `;

    const response = await this.fetchGraphQL(query, {
      first,
      after,
      host: this.host,
    });

    return response.data?.publication?.posts;
  }
}
