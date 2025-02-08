# Top Contractors Denver

A comprehensive contractor directory for the Denver metropolitan area, featuring an integrated blog system with advanced SEO capabilities.

## Features

### Contractor Directory
- Location-based contractor search
- Trade category filtering
- Detailed contractor profiles
- Google Places integration
- Review aggregation

### Blog System
- Integrated Ghost blog platform
- Multi-instance support (combines posts from multiple Ghost blogs)
- Tag-based navigation
- SEO-optimized post pages
- Automatic search engine notifications

### SEO Features
- Dynamic sitemap generation with rate limiting
  - Includes all static pages, trade pages, blog posts, and videos
  - Built-in rate limiting to prevent API throttling
  - Generates comprehensive sitemap with 790+ URLs
- Structured data (Schema.org)
- IndexNow API integration
- Optimized meta tags
- Automatic search engine notifications

## Tech Stack
- Next.js 14.0.4
- TypeScript
- Tailwind CSS
- Supabase
- Ghost Content API

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Ghost blog instance(s)
- Supabase account
- Google Places API key (for contractor data)

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Vicsicard/Top_Contractors_1_20_25.git
   cd Top_Contractors_1_20_25
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with the following variables:
   ```env
   # Ghost Blog Configuration
   GHOST_URL=your_ghost_url
   GHOST_ORG_CONTENT_API_KEY=your_ghost_api_key
   
   # Optional: Second Ghost Instance
   OLD_GHOST_URL=your_old_ghost_url
   OLD_GHOST_KEY=your_old_ghost_api_key
   
   # Search Engine Integration
   INDEXNOW_KEY=your_indexnow_key
   
   # Google Places API
   GOOGLE_PLACES_API_KEY=your_google_api_key
   ```

4. Generate IndexNow key:
   ```bash
   node scripts/generate-indexnow-key.js
   ```

### Development
```bash
npm run dev
# or
yarn dev
```

### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Sitemap Generation
```bash
# Generate a new sitemap with rate limiting
node scripts/generate-sitemap-with-limits.mjs
```

## Project Structure
```
├── scripts/
│   ├── generate-sitemap.mjs          # Legacy sitemap generator
│   ├── generate-sitemap-with-limits.mjs  # Rate-limited sitemap generator
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/         # Reusable components
│   ├── utils/             # Utility functions
│   │   ├── ghost.ts       # Ghost blog integration
│   │   └── indexing.ts    # Search engine notifications
│   └── scripts/           # Utility scripts
├── public/                # Static assets
└── types/                # TypeScript type definitions
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Ghost Headless CMS
- Next.js Team
- Supabase
- Google Places API
