# Database Population Guide

This guide explains how to populate the database with blog posts from different sources.

## Ghost Blog Migration

To migrate blog posts from Ghost to Supabase:

1. Ensure your `.env` file contains the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_OLD_GHOST_URL
   NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY
   NEXT_PUBLIC_GHOST_URL
   NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY
   ```

2. Run the Ghost migration script:
   ```bash
   npm run migrate-ghost
   ```

The script will:
- Connect to both Ghost instances (old and new)
- Fetch all posts with their complete content, including:
  - Title and slug
  - Full HTML content
  - Feature images with alt text
  - Post excerpts/descriptions
  - Author information
  - Publication dates
  - Reading time
  - Trade categories and tags

### Migration Process

1. **Validation**: Each post is validated to ensure it has all required fields:
   - Title
   - Slug
   - HTML content
   - Publication date

2. **Image Processing**: 
   - Feature images are preserved with their URLs and alt text
   - All inline images in the content are processed to ensure absolute URLs
   - Image references are maintained to preserve the visual content

3. **Content Transformation**:
   - HTML content is preserved with proper formatting
   - Author information is structured correctly
   - Tags and categories are properly mapped
   - Dates and metadata are maintained

4. **Error Handling**:
   - Failed migrations are logged with detailed error messages
   - A summary report is generated showing successful and failed migrations
   - Detailed logs are saved in the `scripts/logs` directory

### Monitoring Progress

The migration script provides real-time feedback:
- Shows progress for each post being migrated
- Displays validation results
- Reports successful migrations
- Details any failures with specific error messages

### Troubleshooting

If you encounter issues:

1. Check the log files in `scripts/logs` directory for detailed error messages
2. Verify your environment variables are correctly set
3. Ensure you have proper API access to both Ghost instances
4. Confirm your Supabase connection and permissions are correct

### Post-Migration Verification

After running the migration:

1. Check the Supabase dashboard to verify posts were added
2. Review the migration logs for any warnings or errors
3. Test the website to ensure posts are displaying correctly
4. Verify that images are loading properly
5. Confirm that all post content and formatting is preserved

## Additional Notes

- The migration script uses upsert operations, so it's safe to run multiple times
- Posts are uniquely identified by their source and ID to prevent duplicates
- The script maintains a detailed log of all operations for audit purposes
