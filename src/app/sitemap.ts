import { MetadataRoute } from "next"
import { tradesData } from "@/lib/trades-data"
import { getPosts } from "@/utils/supabase-blog"
import { createClient } from '@/utils/supabase-server'
import { getAllTrades, getAllSubregions } from '@/utils/database'
import { GUIDES } from '@/data/guides'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://topcontractorsdenver.com"
    const now = new Date().toISOString()

    // Get all blog posts
    const { posts } = await getPosts(1, 10000) // Get up to 10000 posts to ensure we get all

    // Generate sitemap entries for blog posts
    const blogEntries = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}/`,
        lastModified: post.updated_at || post.published_at,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Generate sitemap entries for trade pages (legacy /trades/ routes)
    const tradeEntries = Object.keys(tradesData).map((trade) => ({
        url: `${baseUrl}/trades/${trade}/`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Generate sitemap entries for trade blog pages
    const tradeBlogEntries = Object.keys(tradesData).map((trade) => ({
        url: `${baseUrl}/blog/trades/${trade}/`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    // --- Services hub pages: /services/[trade] ---
    const trades = await getAllTrades()
    const serviceEntries = trades.map((trade) => ({
        url: `${baseUrl}/services/${trade.slug}/`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // --- Location hub pages: /locations/[subregion] ---
    const subregions = await getAllSubregions()
    const locationEntries = subregions.map((sub) => ({
        url: `${baseUrl}/locations/${sub.slug}/`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // --- Guide pages: /guides/[slug] ---
    const guideEntries = GUIDES.map((guide) => ({
        url: `${baseUrl}/guides/${guide.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Static pages
    const staticPages = [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/guides/`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog/`,
            lastModified: now,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/trades/`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about/`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact/`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]

    // Get all videos
    const supabase = createClient()
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })

    // Generate sitemap entries for video pages
    const videoEntries = videos?.map((video: { category: string; id: string; created_at: string }) => ({
        url: `${baseUrl}/videos/${video.category}/${video.id}/`,
        lastModified: video.created_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || []

    // Add videos page
    const videosPage = {
        url: `${baseUrl}/videos/`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }

    return [
        ...staticPages,
        videosPage,
        ...serviceEntries,
        ...locationEntries,
        ...guideEntries,
        ...videoEntries,
        ...blogEntries,
        ...tradeEntries,
        ...tradeBlogEntries,
    ]
}
