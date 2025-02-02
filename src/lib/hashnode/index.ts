import { HashnodeClient } from './client';

if (!process.env.HASHNODE_API_KEY) {
  throw new Error('HASHNODE_API_KEY environment variable is not set');
}

if (!process.env.HASHNODE_HOST) {
  throw new Error('HASHNODE_HOST environment variable is not set');
}

export const hashnode = new HashnodeClient(
  process.env.HASHNODE_API_KEY,
  process.env.HASHNODE_HOST
);

export * from './types';
export * from './client';
