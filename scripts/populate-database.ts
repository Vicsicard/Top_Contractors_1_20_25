import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase.js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Add categories (upsert)
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        { category_name: 'Plumber', slug: 'plumbers' },
        { category_name: 'Electrician', slug: 'electricians' },
        { category_name: 'HVAC', slug: 'hvac' },
        { category_name: 'Roofer', slug: 'roofers' },
        { category_name: 'Painter', slug: 'painters' }
      ], { onConflict: 'slug' })
      .select();

    if (categoriesError) throw categoriesError;
    console.log('Added/updated categories:', categories);

    // Add regions (upsert)
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .upsert([
        { region_name: 'Central Denver', slug: 'central-denver' },
        { region_name: 'East Denver', slug: 'east-denver' },
        { region_name: 'Northwest Suburbs', slug: 'northwest-suburbs' },
        { region_name: 'Northeast Suburbs', slug: 'northeast-suburbs' },
        { region_name: 'Southeast Suburbs', slug: 'southeast-suburbs' }
      ], { onConflict: 'slug' })
      .select();

    if (regionsError) throw regionsError;
    console.log('Added/updated regions:', regions);

    // Add subregions for each region
    for (const region of regions) {
      const { data: subregions, error: subregionsError } = await supabase
        .from('subregions')
        .upsert([
          { region_id: region.id, subregion_name: 'Downtown', slug: `${region.slug}-downtown` },
          { region_id: region.id, subregion_name: 'Central Parks', slug: `${region.slug}-central-parks` },
          { region_id: region.id, subregion_name: 'Central Shopping', slug: `${region.slug}-central-shopping` }
        ], { onConflict: 'slug' })
        .select();

      if (subregionsError) throw subregionsError;
      console.log(`Added/updated subregions for ${region.region_name}:`, subregions);

      // Add neighborhoods for each subregion
      for (const subregion of subregions) {
        const { data: neighborhoods, error: neighborhoodsError } = await supabase
          .from('neighborhoods')
          .upsert([
            {
              subregion_id: subregion.id,
              neighborhood_name: `${subregion.subregion_name} Area`,
              slug: `${subregion.slug}-neighborhood`,
              description: `${subregion.subregion_name} area in ${region.region_name}`
            }
          ], { onConflict: 'slug' })
          .select();

        if (neighborhoodsError) throw neighborhoodsError;
        console.log(`Added/updated neighborhood for ${subregion.subregion_name}:`, neighborhoods);

        // Add contractors for each category in this neighborhood
        for (const category of categories) {
          const contractors = Array.from({ length: 10 }, (_, i) => ({
            category_id: category.id,
            neighborhood_id: neighborhoods[0].id,
            contractor_name: `${category.category_name} Pro ${i + 1}`,
            address: `${1000 + i} Main St`,
            phone: `(303) 555-${1000 + i}`,
            website: `https://www.${category.slug}pro${i + 1}.com`,
            reviews_avg: 4 + Math.random(),
            reviews_count: Math.floor(Math.random() * 100) + 10,
            slug: `${category.slug}-pro-${i + 1}`
          }));

          const { error: contractorsError } = await supabase
            .from('contractors')
            .upsert(contractors, { onConflict: 'slug' });

          if (contractorsError) throw contractorsError;
          console.log(`Added/updated ${contractors.length} contractors for ${category.category_name} in ${neighborhoods[0].neighborhood_name}`);
        }
      }
    }

    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();
