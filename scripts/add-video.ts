import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addVideo() {
  const { data, error } = await supabase
    .from('videos')
    .insert([
      {
        title: "Remodel Your Kitchen with Denver's Top Contractors",
        description: "Learn about kitchen remodeling services from Denver's top contractors",
        youtube_id: 'vEyJtcJuCAA',
        category: 'kitchen-remodeling',
        related_services: ['kitchen-remodelers']
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting video:', error);
    return;
  }

  console.log('Video added successfully:', data);
}

addVideo().catch(console.error);
