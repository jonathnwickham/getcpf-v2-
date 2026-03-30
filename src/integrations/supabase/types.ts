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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          created_at: string
          email: string
          id: string
          motivation: string | null
          name: string
          platform: string | null
          posting_frequency: string | null
          situation: string | null
          why: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          motivation?: string | null
          name: string
          platform?: string | null
          posting_frequency?: string | null
          situation?: string | null
          why?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          motivation?: string | null
          name?: string
          platform?: string | null
          posting_frequency?: string | null
          situation?: string | null
          why?: string | null
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          commission_percent: number
          created_at: string
          email: string
          id: string
          location: string | null
          motivation: string | null
          name: string
          notes: string | null
          platform: string | null
          posting_frequency: string | null
          promo_code: string | null
          situation: string | null
          source: string | null
          status: string
          why: string | null
        }
        Insert: {
          commission_percent?: number
          created_at?: string
          email: string
          id?: string
          location?: string | null
          motivation?: string | null
          name: string
          notes?: string | null
          platform?: string | null
          posting_frequency?: string | null
          promo_code?: string | null
          situation?: string | null
          source?: string | null
          status?: string
          why?: string | null
        }
        Update: {
          commission_percent?: number
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          motivation?: string | null
          name?: string
          notes?: string | null
          platform?: string | null
          posting_frequency?: string | null
          promo_code?: string | null
          situation?: string | null
          source?: string | null
          status?: string
          why?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          address_proof_url: string | null
          city: string | null
          cpf_number: string | null
          created_at: string | null
          discount_amount: number | null
          email: string | null
          father_name: string | null
          final_price: number | null
          full_name: string | null
          host_address: string | null
          host_city: string | null
          host_cpf: string | null
          host_name: string | null
          id: string
          mother_alternative: string | null
          mother_name: string | null
          nationality: string | null
          no_mother: boolean | null
          notes: string | null
          passport_number: string | null
          passport_photo_url: string | null
          promo_code: string | null
          protocol_number: string | null
          received_at: string | null
          selfie_url: string | null
          state_code: string | null
          state_name: string | null
          status: string | null
          staying_with_friend: boolean | null
          street_address: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_proof_url?: string | null
          city?: string | null
          cpf_number?: string | null
          created_at?: string | null
          discount_amount?: number | null
          email?: string | null
          father_name?: string | null
          final_price?: number | null
          full_name?: string | null
          host_address?: string | null
          host_city?: string | null
          host_cpf?: string | null
          host_name?: string | null
          id?: string
          mother_alternative?: string | null
          mother_name?: string | null
          nationality?: string | null
          no_mother?: boolean | null
          notes?: string | null
          passport_number?: string | null
          passport_photo_url?: string | null
          promo_code?: string | null
          protocol_number?: string | null
          received_at?: string | null
          selfie_url?: string | null
          state_code?: string | null
          state_name?: string | null
          status?: string | null
          staying_with_friend?: boolean | null
          street_address?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_proof_url?: string | null
          city?: string | null
          cpf_number?: string | null
          created_at?: string | null
          discount_amount?: number | null
          email?: string | null
          father_name?: string | null
          final_price?: number | null
          full_name?: string | null
          host_address?: string | null
          host_city?: string | null
          host_cpf?: string | null
          host_name?: string | null
          id?: string
          mother_alternative?: string | null
          mother_name?: string | null
          nationality?: string | null
          no_mother?: boolean | null
          notes?: string | null
          passport_number?: string | null
          passport_photo_url?: string | null
          promo_code?: string | null
          protocol_number?: string | null
          received_at?: string | null
          selfie_url?: string | null
          state_code?: string | null
          state_name?: string | null
          status?: string | null
          staying_with_friend?: boolean | null
          street_address?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      consent_log: {
        Row: {
          consent: boolean
          consent_text: string
          consent_version: string
          consented_at: string
          id: string
          user_id: string
        }
        Insert: {
          consent?: boolean
          consent_text: string
          consent_version?: string
          consented_at?: string
          id?: string
          user_id: string
        }
        Update: {
          consent?: boolean
          consent_text?: string
          consent_version?: string
          consented_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          application_id: string
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          application_id: string
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country_code: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          location: string | null
          plan: string | null
          stripe_customer_id: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          affiliate_commission_percent: number
          affiliate_email: string | null
          affiliate_location: string | null
          affiliate_name: string | null
          affiliate_notes: string | null
          affiliate_source: string | null
          code: string
          created_at: string
          discount_percent: number
          id: string
          is_active: boolean
          max_uses: number | null
          times_used: number
        }
        Insert: {
          affiliate_commission_percent?: number
          affiliate_email?: string | null
          affiliate_location?: string | null
          affiliate_name?: string | null
          affiliate_notes?: string | null
          affiliate_source?: string | null
          code: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          times_used?: number
        }
        Update: {
          affiliate_commission_percent?: number
          affiliate_email?: string | null
          affiliate_location?: string | null
          affiliate_name?: string | null
          affiliate_notes?: string | null
          affiliate_source?: string | null
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          times_used?: number
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          created_at: string
          entry_date: string
          entry_type: string
          id: string
          notes: string | null
          transaction_id: string | null
          user_email: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          entry_date?: string
          entry_type?: string
          id?: string
          notes?: string | null
          transaction_id?: string | null
          user_email?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          entry_date?: string
          entry_type?: string
          id?: string
          notes?: string | null
          transaction_id?: string | null
          user_email?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          plan: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          plan: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          plan?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_promo_codes: {
        Row: {
          code: string | null
          discount_percent: number | null
          is_active: boolean | null
        }
        Insert: {
          code?: string | null
          discount_percent?: number | null
          is_active?: boolean | null
        }
        Update: {
          code?: string | null
          discount_percent?: number | null
          is_active?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
