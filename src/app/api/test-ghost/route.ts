import { NextResponse } from 'next/server';
import { getPosts } from '@/utils/supabase-blog';

export async function GET() {
    try {
        console.log('Testing Supabase connection...');
        console.log('Supabase Key:', process.env['SUPABASE_KEY']);

        const { posts } = await getPosts(1, 1);
        
        return NextResponse.json({
            success: true,
            message: 'Successfully connected to Supabase',
            post: posts[0]
        });
    } catch (error) {
        console.error('Error testing Supabase connection:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to Supabase',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
