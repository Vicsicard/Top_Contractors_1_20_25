import { NextResponse } from 'next/server';
import { generateIndexNowKeyFile } from '@/utils/indexing';

export async function GET() {
    const key = process.env.INDEXNOW_KEY;
    
    if (!key) {
        return new NextResponse('Key not configured', { status: 404 });
    }

    return new NextResponse(generateIndexNowKeyFile(key), {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
