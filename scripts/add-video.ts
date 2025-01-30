import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findAndUpdateVideo() {
  // First, let's find the video in the basement-remodeling category
  const { data: videos, error: findError } = await supabase
    .from('videos')
    .select('*')
    .eq('category', 'basement-remodeling');

  if (findError) {
    console.error('Error finding video:', findError);
    return;
  }

  console.log('Found videos:', videos);

  if (videos && videos.length > 0) {
    // Update the video we found
    const { data, error } = await supabase
      .from('videos')
      .update({
        title: "Transform Your Backyard: Find the Best Outdoor Kitchen Contractors in Denver!",
        description: "Imagine crafting the perfect outdoor kitchen.",
        category: 'kitchen-remodeling',
        related_services: ['kitchen-remodelers']
      })
      .eq('id', videos[0].id)
      .select();

    if (error) {
      console.error('Error updating video:', error);
      return;
    }

    console.log('Video updated successfully:', data);
  } else {
    console.log('No videos found in basement-remodeling category');
  }
}

findAndUpdateVideo().catch(console.error);
