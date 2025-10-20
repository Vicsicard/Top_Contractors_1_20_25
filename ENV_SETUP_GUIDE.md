# Environment Variables Setup Guide

This guide explains how to set up the environment variables required for the Top Contractors Denver project, particularly for running scripts like sitemap generation and database operations.

## Required Environment Variables

The project uses two Supabase projects, each requiring its own set of environment variables:

### Main Supabase Project (Videos and Categories)
```
NEXT_PUBLIC_MAIN_SUPABASE_URL=https://bmiyyaexngxbrzkyqgzk.supabase.co
NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY=your_anon_key
MAIN_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Blog Supabase Project
```
NEXT_PUBLIC_BLOG_SUPABASE_URL=https://duofozyjmsicofmnmsal.supabase.co
NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY=your_anon_key
BLOG_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Other Required Variables
```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
INDEXNOW_KEY=your_indexnow_key
```

## Setting Up Environment Variables

1. Create a `.env.local` file in the project root if it doesn't exist already
2. Copy the variables above and replace the placeholder values with your actual keys
3. Make sure not to commit this file to version control (it should be in .gitignore)

## Running Scripts with Environment Variables

When running scripts that require environment variables, ensure they're properly loaded:

### Node.js Scripts
Node.js scripts should include:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

### Running Scripts
```bash
# For ESM scripts
node scripts/generate-sitemap-with-limits.mjs

# For CommonJS scripts
node scripts/submit-sitemap-to-google.js
```

## Troubleshooting

If you encounter "Missing Supabase environment variables" errors:

1. Check that your `.env.local` file exists and contains all required variables
2. Verify that the script is properly loading the environment variables
3. For ESM modules, ensure dotenv is properly configured

## Environment Variables for Different Environments

### Development
Use `.env.local` for local development.

### Production
For production deployments, set these variables in your hosting platform (e.g., Vercel).

## Security Notes

- Never commit API keys or sensitive environment variables to version control
- Use service role keys only for server-side operations, never in client-side code
- Rotate keys periodically for better security
