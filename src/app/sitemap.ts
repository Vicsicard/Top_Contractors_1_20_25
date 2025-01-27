import { MetadataRoute } from "next"
import { tradesData } from "@/lib/trades-data"
import { getPosts } from "@/utils/supabase-blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://topcontractorsdenver.com"

    // Get all blog posts
    const { posts } = await getPosts(1, 1000) // Get up to 1000 posts

    // Generate sitemap entries for blog posts
    const blogEntries = posts.map((post) => ({
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

    return [...staticPages, ...blogEntries, ...tradeEntries, ...tradeBlogEntries]
}
