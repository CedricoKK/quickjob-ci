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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      job_applications: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          job_id: string
          message: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          job_id: string
          message?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          message?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          category: Database["public"]["Enums"]["job_category"]
          city: string
          commune: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_urgent: boolean | null
          latitude: number | null
          longitude: number | null
          quartier: string | null
          recruiter_id: string
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["job_category"]
          city: string
          commune?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          latitude?: number | null
          longitude?: number | null
          quartier?: string | null
          recruiter_id: string
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["job_category"]
          city?: string
          commune?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          latitude?: number | null
          longitude?: number | null
          quartier?: string | null
          recruiter_id?: string
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          commune: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          quartier: string | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commune?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          quartier?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commune?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          quartier?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_active: boolean | null
          paystack_customer_code: string | null
          paystack_subscription_code: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_active?: boolean | null
          paystack_customer_code?: string | null
          paystack_subscription_code?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_active?: boolean | null
          paystack_customer_code?: string | null
          paystack_subscription_code?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      jobs_public_safe: {
        Row: {
          category: Database["public"]["Enums"]["job_category"] | null
          city: string | null
          commune: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_urgent: boolean | null
          latitude: number | null
          longitude: number | null
          quartier: string | null
          recruiter_id: string | null
          salary_max: number | null
          salary_min: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["job_category"] | null
          city?: string | null
          commune?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          latitude?: number | null
          longitude?: number | null
          quartier?: string | null
          recruiter_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["job_category"] | null
          city?: string | null
          commune?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          latitude?: number | null
          longitude?: number | null
          quartier?: string | null
          recruiter_id?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_can_access_job_contact: {
        Args: { job_id: string; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      job_category:
        | "menage"
        | "jardinage"
        | "bricolage"
        | "livraison"
        | "garde_enfant"
        | "aide_personne_agee"
        | "cours_particulier"
        | "evenementiel"
        | "restauration"
        | "informatique"
        | "autre"
      subscription_plan: "free" | "standard" | "pro" | "enterprise"
      user_role: "candidate" | "recruiter" | "admin"
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
      job_category: [
        "menage",
        "jardinage",
        "bricolage",
        "livraison",
        "garde_enfant",
        "aide_personne_agee",
        "cours_particulier",
        "evenementiel",
        "restauration",
        "informatique",
        "autre",
      ],
      subscription_plan: ["free", "standard", "pro", "enterprise"],
      user_role: ["candidate", "recruiter", "admin"],
    },
  },
} as const
