export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          analytics_id: number
          created_at: string | null
          total_blog_posts: number
          total_comments: number
          total_users: number
          total_views: number
          updated_at: string | null
        }
        Insert: {
          analytics_id?: number
          created_at?: string | null
          total_blog_posts?: number
          total_comments?: number
          total_users?: number
          total_views?: number
          updated_at?: string | null
        }
        Update: {
          analytics_id?: number
          created_at?: string | null
          total_blog_posts?: number
          total_comments?: number
          total_users?: number
          total_views?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      blogpost: {
        Row: {
          author_id: number | null
          content: string
          created_at: string | null
          images: string[] | null
          post_id: number
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: number | null
          content: string
          created_at?: string | null
          images?: string[] | null
          post_id?: number
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: number | null
          content?: string
          created_at?: string | null
          images?: string[] | null
          post_id?: number
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogpost_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comments: {
        Row: {
          comment_id: number
          content: string
          created_at: string | null
          post_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          comment_id?: number
          content: string
          created_at?: string | null
          post_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          comment_id?: number
          content?: string
          created_at?: string | null
          post_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blogpost"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          is_read: boolean | null
          message: string | null
          notification_id: number
          related_entity_id: number | null
          type: string
          user_id: number | null
        }
        Insert: {
          created_at?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id?: number
          related_entity_id?: number | null
          type: string
          user_id?: number | null
        }
        Update: {
          created_at?: string | null
          is_read?: boolean | null
          message?: string | null
          notification_id?: number
          related_entity_id?: number | null
          type?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          password_hash: string
          profile_picture_url: string | null
          role: string | null
          updated_at: string | null
          user_id: number
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          password_hash: string
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: number
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          password_hash?: string
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: number
          username?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
