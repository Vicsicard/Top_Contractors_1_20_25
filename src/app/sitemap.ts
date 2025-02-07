import { MetadataRoute } from "next"
import { tradesData } from "@/lib/trades-data"
import { createClient } from '@/utils/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://topcontractorsdenver.com"

    // Get all blog posts directly from Supabase
    const supabase = createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at, published_at')
        .order('published_at', { ascending: false })

    // Generate sitemap entries for blog posts
    const blogEntries = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at || post.published_at,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Generate sitemap entries for trade pages
    const tradeEntries = Object.keys(tradesData).map((trade) => ({
        url: `${baseUrl}/trades/${trade}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Generate sitemap entries for trade blog pages
    const tradeBlogEntries = Object.keys(tradesData).map((trade) => ({
        url: `${baseUrl}/blog/trades/${trade}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/trades`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]

    // Get all videos
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    // Generate sitemap entries for video pages
    const videoEntries = videos?.map((video) => ({
        url: `${baseUrl}/videos/${video.category}/${video.id}`,
        lastModified: video.created_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || []

    // Add videos page
    const videosPage = {
        url: `${baseUrl}/videos`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }

    return [
        ...staticPages,
        videosPage,
        ...videoEntries,
        ...blogEntries,
        ...tradeEntries,
        ...tradeBlogEntries
    ]
}
