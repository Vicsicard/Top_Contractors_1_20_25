import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from project root
config({ path: resolve(__dirname, '../.env.local') });

import { supabase } from '../src/utils/supabase';

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...');
    
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id, trade_category')
            .limit(1);
            
        if (error) {
            console.error('Supabase connection error:', error);
            return;
        }
        
        console.log('Connection successful!');
        console.log('Posts found:', data?.length || 0);
        if (data && data.length > 0) {
            console.log('Sample post:', data[0]);
        }
    } catch (error) {
        console.error('Failed to test Supabase connection:', error);
    }
}

testSupabaseConnection();
