# Structured Data Implementation for SEO

This document outlines the structured data implementation across the website to enhance SEO and improve search engine visibility.

## Overview of Structured Data Implementation

We've implemented comprehensive structured data (Schema.org) markup across the website to help search engines better understand our content and potentially display rich results in search engine result pages (SERPs).

## Schema Types Implemented

1. **LocalBusiness Schema**
   - Implemented on trade pages, location pages, and contractor listings
   - Includes business name, address, service areas, and contact information
   - Enhanced with proper geo-coordinates for Denver area

2. **Service Schema**
   - Applied to service and trade pages
   - Clearly defines service offerings with detailed descriptions
   - Links services to local business information

3. **FAQPage Schema**
   - Implemented on pages with FAQ sections
   - Structures questions and answers for potential rich results in search

4. **BreadcrumbList Schema**
   - Added to all content pages for improved site navigation understanding
   - Helps search engines understand site hierarchy

5. **BlogPosting Schema**
   - Applied to all blog articles
   - Includes article metadata such as author, publish date, and categories
   - Enhances chances of appearing in news and article-related rich results

6. **WebSite and WebPage Schema**
   - Implemented site-wide to establish the identity of the website
   - Includes search action potential for sitelinks search box

7. **Review Aggregation**
   - Added to contractor listings to highlight ratings and reviews
   - Structured to potentially show star ratings in search results

## Implementation Method

We've implemented structured data using script tags with JSON-LD format, which is Google's preferred method. This approach separates the structured data from the visible HTML, making it easier to maintain.

Each schema is dynamically generated based on the page content, ensuring that the structured data accurately reflects the visible content of each page.

## Key Files Modified

1. `src/utils/schema.ts` - Contains all schema generation functions
2. Various page components:
   - Trade location pages
   - Service pages
   - Blog posts and listings
   - Contractor cards

## Testing and Validation

The structured data implementation should be tested using:

1. Google's Rich Results Test tool: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/
3. Google Search Console after deployment to monitor for any structured data errors

## Future Enhancements

Potential enhancements to consider:

1. **Product Schema** - For any specific products or equipment featured
2. **Event Schema** - If the site ever hosts or promotes events
3. **HowTo Schema** - For tutorial-style content in the blog
4. **JobPosting Schema** - If contractor job opportunities are ever listed

## Best Practices for Maintenance

When creating new page templates or content types:

1. Always implement appropriate structured data from the beginning
2. Ensure structured data matches visible content (avoid "invisible" structured data)
3. Keep JSON-LD implementations up-to-date with Schema.org standards
4. Regularly test for errors using Google Search Console
