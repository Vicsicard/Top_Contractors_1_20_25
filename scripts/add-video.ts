import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const videos = [
  {
    title: "Elevate Your Outdoor Space with Luxury Deck Builders in Denver",
    description: "Denver deck contractors specializing in luxury builds can help you create a high-end retreat that perfectly complements your home and the breathtaking Colorado landscape.",
    youtube_id: "SKmXdsjsANM",
    category: "decks",
    related_services: ['decks']
  },
  {
    title: "Outdoor Space with a Landscape Design Consultation in Denver",
    description: "Whether you're looking for a lush garden retreat or a low-maintenance outdoor space, professional landscapers in Denver can help bring your vision to life.",
    youtube_id: "qCwI3SZDUCM",
    category: "landscaping",
    related_services: ['landscapers']
  },
  {
    title: "Remodeling Luxury Homes in Denver with Top Contractors Denver",
    description: "Your home is more than just a place to live—it's a statement of your style, success, and vision. Whether you're upgrading to high-end finishes, modernizing your living space, or undertaking a full-scale luxury renovation, the right contractor makes all the difference.",
    youtube_id: "MtFMi1RMg4I",
    category: "home-remodeling",
    related_services: ['home-remodelers']
  },
  {
    title: "Remodel Your Kitchen with Denver's Top Contractors",
    description: "Whether you're upgrading outdated cabinets, installing energy-efficient appliances, or creating an open-concept layout for entertaining, a successful kitchen remodel starts with finding the right contractor.",
    youtube_id: "vEyJtcJuCAA",
    category: "kitchen-remodeling",
    related_services: ['kitchen-remodelers']
  },
  {
    title: "Bathtub Replacement Advice for Denver Homeowners",
    description: "If you're considering a bathtub replacement in Denver, you're making a smart investment in both your home's value and your daily comfort.",
    youtube_id: "ii3eWsso5FE",
    category: "bathroom-remodeling",
    related_services: ['bathroom-remodelers']
  },
  {
    title: "Find the Best Plumbers in Denver at Top Contractors Denver",
    description: "Whether you need a quick repair, new fixture installations, or a complete plumbing system upgrade, finding the right plumber is key.",
    youtube_id: "UYMH4rCLr08",
    category: "plumbing",
    related_services: ['plumbers']
  },
  {
    title: "Transform Your Bathroom with Denver's Top Contractors",
    description: "Whether you're updating an outdated space or designing a luxurious retreat, your journey starts with finding the right contractor.",
    youtube_id: "sosa3Zk6xto",
    category: "bathroom-remodeling",
    related_services: ['bathroom-remodelers']
  }
];

async function addVideos() {
  for (const video of videos) {
    const { data, error } = await supabase
      .from('videos')
      .insert([video])
      .select();

    if (error) {
      console.error(`Error adding video ${video.youtube_id}:`, error);
      continue;
    }

    console.log(`Successfully added video ${video.youtube_id}:`, data);
  }
}

addVideos().catch(console.error);
