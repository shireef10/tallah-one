export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          banner_image_url: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          pinned: boolean
          priority: Database["public"]["Enums"]["announcement_priority"]
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          priority?: Database["public"]["Enums"]["announcement_priority"]
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          priority?: Database["public"]["Enums"]["announcement_priority"]
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          helpful_count: number
          id: string
          not_helpful_count: number
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          helpful_count?: number
          id?: string
          not_helpful_count?: number
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          helpful_count?: number
          id?: string
          not_helpful_count?: number
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_articles: {
        Row: {
          attachments: Json
          category_id: string | null
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          attachments?: Json
          category_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          attachments?: Json
          category_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "knowledge_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      meeting_links: {
        Row: {
          active: boolean
          created_at: string
          department: string | null
          description: string | null
          id: string
          name: string
          provider: string | null
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          name: string
          provider?: string | null
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          name?: string
          provider?: string | null
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      processes: {
        Row: {
          attachments: Json
          content: string
          created_at: string
          created_by: string | null
          department: string | null
          flowchart_url: string | null
          id: string
          owner: string | null
          published: boolean
          slug: string
          summary: string | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          attachments?: Json
          content?: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          flowchart_url?: string | null
          id?: string
          owner?: string | null
          published?: boolean
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          attachments?: Json
          content?: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          flowchart_url?: string | null
          id?: string
          owner?: string | null
          published?: boolean
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_request_types: {
        Row: {
          active: boolean
          created_at: string
          department: string | null
          description: string | null
          fields: Json
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          department?: string | null
          description?: string | null
          fields?: Json
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          assignee_id: string | null
          created_at: string
          id: string
          notes: string | null
          payload: Json
          status: Database["public"]["Enums"]["request_status"]
          type_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payload?: Json
          status?: Database["public"]["Enums"]["request_status"]
          type_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payload?: Json
          status?: Database["public"]["Enums"]["request_status"]
          type_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "service_request_types"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assignee_id: string | null
          attachments: Json
          category: string
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          attachments?: Json
          category?: string
          created_at?: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          attachments?: Json
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          photo_url: string | null
          position: string | null
          sort_order: number | null
          updated_at: string
          whatsapp_group_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          sort_order?: number | null
          updated_at?: string
          whatsapp_group_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo_url?: string | null
          position?: string | null
          sort_order?: number | null
          updated_at?: string
          whatsapp_group_url?: string | null
        }
        Relationships: []
      }
      tutorial_bookmarks: {
        Row: {
          created_at: string
          id: string
          tutorial_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tutorial_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tutorial_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutorial_bookmarks_tutorial_id_fkey"
            columns: ["tutorial_id"]
            isOneToOne: false
            referencedRelation: "tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorials: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          pdf_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          pdf_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          pdf_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workspace_tools: {
        Row: {
          access_url: string | null
          category: string
          created_at: string
          description: string | null
          documentation_url: string | null
          id: string
          logo_url: string | null
          name: string
          sort_order: number | null
          tutorial_url: string | null
          updated_at: string
        }
        Insert: {
          access_url?: string | null
          category: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          logo_url?: string | null
          name: string
          sort_order?: number | null
          tutorial_url?: string | null
          updated_at?: string
        }
        Update: {
          access_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          tutorial_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      announcement_priority: "low" | "normal" | "high" | "critical"
      app_permission:
        | "view_dashboard"
        | "manage_homepage"
        | "manage_announcements"
        | "manage_tutorials"
        | "manage_knowledge"
        | "manage_processes"
        | "manage_faqs"
        | "manage_team"
        | "manage_vendors"
        | "manage_partners"
        | "manage_meetings"
        | "manage_workspace_tools"
        | "manage_service_requests"
        | "manage_support_tickets"
        | "manage_users"
        | "manage_roles"
        | "manage_media"
        | "manage_audit"
        | "manage_settings"
      app_role:
        | "super_admin"
        | "digital_transformation"
        | "department_manager"
        | "employee"
        | "content_manager"
        | "support_agent"
        | "team_lead"
        | "read_only"
      request_status:
        | "pending"
        | "approved"
        | "in_progress"
        | "completed"
        | "rejected"
      ticket_priority: "low" | "normal" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_priority: ["low", "normal", "high", "critical"],
      app_permission: [
        "view_dashboard",
        "manage_homepage",
        "manage_announcements",
        "manage_tutorials",
        "manage_knowledge",
        "manage_processes",
        "manage_faqs",
        "manage_team",
        "manage_vendors",
        "manage_partners",
        "manage_meetings",
        "manage_workspace_tools",
        "manage_service_requests",
        "manage_support_tickets",
        "manage_users",
        "manage_roles",
        "manage_media",
        "manage_audit",
        "manage_settings",
      ],
      app_role: [
        "super_admin",
        "digital_transformation",
        "department_manager",
        "employee",
        "content_manager",
        "support_agent",
        "team_lead",
        "read_only",
      ],
      request_status: [
        "pending",
        "approved",
        "in_progress",
        "completed",
        "rejected",
      ],
      ticket_priority: ["low", "normal", "high", "urgent"],
      ticket_status: ["open", "in_progress", "waiting", "resolved", "closed"],
    },
  },
} as const
