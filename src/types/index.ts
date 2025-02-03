export interface Post {
  id: number
  hashnode_id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image?: string
  cover_image_alt?: string
  published_at: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}
