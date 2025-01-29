import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function populateBlogPosts() {
  try {
    console.log('Starting blog posts population...');

    // Sample blog posts data
    const blogPosts = [
      {
        title: 'Top 10 Home Remodeling Trends for 2025',
        slug: 'top-10-home-remodeling-trends-2025',
        html: '<p>Discover the latest home remodeling trends that are taking Denver by storm in 2025...</p>',
        feature_image: '/images/blog/home-remodeling-trends.jpg',
        feature_image_alt: 'Modern home interior after remodeling',
        excerpt: 'Stay ahead of the curve with these emerging home remodeling trends that combine style, sustainability, and smart technology.',
        trade_category: 'home-remodeling',
        reading_time: 8,
        published_at: new Date().toISOString()
      },
      {
        title: 'Essential Plumbing Maintenance Tips for Winter',
        slug: 'winter-plumbing-maintenance-tips',
        html: '<p>Protect your pipes and prevent costly repairs with these essential winter maintenance tips...</p>',
        feature_image: '/images/blog/winter-plumbing.jpg',
        feature_image_alt: 'Plumber fixing a pipe',
        excerpt: 'Learn how to protect your plumbing system during Denver\'s cold winter months with our expert maintenance guide.',
        trade_category: 'plumbers',
        reading_time: 6,
        published_at: new Date().toISOString()
      },
      {
        title: 'How to Choose the Right HVAC System',
        slug: 'choosing-right-hvac-system',
        html: '<p>A comprehensive guide to selecting the perfect HVAC system for your Denver home...</p>',
        feature_image: '/images/blog/hvac-guide.jpg',
        feature_image_alt: 'Modern HVAC system installation',
        excerpt: 'Navigate the complex world of HVAC systems with our expert guide to finding the perfect solution for your home.',
        trade_category: 'hvac',
        reading_time: 10,
        published_at: new Date().toISOString()
      },
      {
        title: 'Common Plumbing Problems and How to Fix Them',
        slug: 'common-plumbing-problems-solutions',
        html: '<p>A comprehensive guide to identifying and fixing common household plumbing issues...</p>',
        feature_image: '/images/blog/plumbing-problems.jpg',
        feature_image_alt: 'Plumber working on sink',
        excerpt: 'Learn how to diagnose and fix common plumbing problems with our expert troubleshooting guide.',
        trade_category: 'plumbers',
        reading_time: 7,
        published_at: new Date().toISOString()
      },
      {
        title: 'Water Heater Maintenance: A Complete Guide',
        slug: 'water-heater-maintenance-guide',
        html: '<p>Everything you need to know about maintaining your water heater for optimal performance...</p>',
        feature_image: '/images/blog/water-heater.jpg',
        feature_image_alt: 'Modern water heater installation',
        excerpt: 'Keep your water heater running efficiently with our comprehensive maintenance guide.',
        trade_category: 'plumbers',
        reading_time: 10,
        published_at: new Date().toISOString()
      }
    ];

    // Insert blog posts
    const { error: insertError } = await supabase
      .from('posts')
      .upsert(blogPosts, { onConflict: 'slug' });

    if (insertError) throw insertError;

    console.log('Blog posts population completed successfully!');

    // Verify the posts were added
    const { data: posts, error: verifyError } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (verifyError) throw verifyError;

    console.log('Added blog posts:', posts);
  } catch (error) {
    console.error('Error populating blog posts:', error);
    process.exit(1);
  }
}

populateBlogPosts();
