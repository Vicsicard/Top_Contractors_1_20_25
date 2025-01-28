export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          html: string
          feature_image?: string
          feature_image_alt?: string
          excerpt?: string
          published_at: string
          updated_at?: string
          reading_time?: number
          trade_category?: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          html: string
          feature_image?: string
          feature_image_alt?: string
          excerpt?: string
          published_at?: string
          updated_at?: string
          reading_time?: number
          trade_category?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          html?: string
          feature_image?: string
          feature_image_alt?: string
          excerpt?: string
          published_at?: string
          updated_at?: string
          reading_time?: number
          trade_category?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      subregions: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      contractors: {
        Row: {
          id: string
          category_id: string
          subregion_id: string
          name: string
          slug: string
          address: string
          phone: string
          website: string | null
          rating: number
          reviews_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          subregion_id: string
          name: string
          slug: string
          address: string
          phone: string
          website?: string | null
          rating: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          subregion_id?: string
          name?: string
          slug?: string
          address?: string
          phone?: string
          website?: string | null
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
