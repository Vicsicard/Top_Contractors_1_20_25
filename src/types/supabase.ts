export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_id: string;
          category: string;
          timestamps: Record<string, string> | null;
          transcript: string | null;
          related_services: string[] | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          youtube_id: string;
          category: string;
          timestamps?: Record<string, string> | null;
          transcript?: string | null;
          related_services?: string[] | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          youtube_id?: string;
          category?: string;
          timestamps?: Record<string, string> | null;
          transcript?: string | null;
          related_services?: string[] | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
  };
}
