import fetch from 'node-fetch';

const HASHNODE_API_URL = 'https://gql.hashnode.com';
const apiKey = process.env.HASHNODE_API_KEY || '';

async function createTag(name: string, slug: string) {
  const query = `
    mutation CreateTag($input: CreateTagInput!) {
      createTag(input: $input) {
        tag {
          id
          name
          slug
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
          name: name,
          slug: slug
        },
      },
    }),
  });

  const result = await response.json();
  console.log('Create tag response:', JSON.stringify(result, null, 2));
  
  if (result.errors) {
    throw new Error(`Failed to create tag: ${result.errors[0].message}`);
  }

  return result.data.createTag;
}

async function createBathroomTag() {
  try {
    console.log('Creating bathroom-remodeling tag...');
    const tag = await createTag('Bathroom Remodeling', 'bathroom-remodeling');
    console.log('✅ Tag created successfully:', tag);
  } catch (error) {
    console.error('Error creating tag:', error);
  }
}

// Run the tag creation
createBathroomTag();
