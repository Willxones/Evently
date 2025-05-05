export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      _PurchaseToTicket: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_PurchaseToTicket_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Purchase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_PurchaseToTicket_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Ticket"
            referencedColumns: ["id"]
          },
        ]
      }
      Event: {
        Row: {
          createdAt: string
          description: string
          endDate: string
          eventStatus: Database["public"]["Enums"]["EventStatus"]
          id: string
          image: string | null
          location: string
          name: string
          organiserId: string
          startDate: string
        }
        Insert: {
          createdAt?: string
          description: string
          endDate: string
          eventStatus?: Database["public"]["Enums"]["EventStatus"]
          id: string
          image?: string | null
          location: string
          name: string
          organiserId: string
          startDate: string
        }
        Update: {
          createdAt?: string
          description?: string
          endDate?: string
          eventStatus?: Database["public"]["Enums"]["EventStatus"]
          id?: string
          image?: string | null
          location?: string
          name?: string
          organiserId?: string
          startDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "Event_organiserId_fkey"
            columns: ["organiserId"]
            isOneToOne: false
            referencedRelation: "Organiser"
            referencedColumns: ["id"]
          },
        ]
      }
      Organiser: {
        Row: {
          bannerImage: string
          createdAt: string
          description: string
          id: string
          linkedIn: string | null
          logoImage: string
          name: string
          twitter: string | null
          userId: string
          website: string | null
        }
        Insert: {
          bannerImage: string
          createdAt?: string
          description: string
          id: string
          linkedIn?: string | null
          logoImage: string
          name: string
          twitter?: string | null
          userId: string
          website?: string | null
        }
        Update: {
          bannerImage?: string
          createdAt?: string
          description?: string
          id?: string
          linkedIn?: string | null
          logoImage?: string
          name?: string
          twitter?: string | null
          userId?: string
          website?: string | null
        }
        Relationships: []
      }
      Profile: {
        Row: {
          bio: string | null
          createdAt: string
          firstName: string
          github: string | null
          id: string
          image: string | null
          interests: string[] | null
          lastName: string
          linkedIn: string | null
          location: string
          twitter: string | null
          userId: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          createdAt?: string
          firstName: string
          github?: string | null
          id: string
          image?: string | null
          interests?: string[] | null
          lastName: string
          linkedIn?: string | null
          location: string
          twitter?: string | null
          userId: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          createdAt?: string
          firstName?: string
          github?: string | null
          id?: string
          image?: string | null
          interests?: string[] | null
          lastName?: string
          linkedIn?: string | null
          location?: string
          twitter?: string | null
          userId?: string
          website?: string | null
        }
        Relationships: []
      }
      Purchase: {
        Row: {
          createdAt: string
          id: string
          profileId: string
          status: Database["public"]["Enums"]["PurchaseStatus"]
          totalAmount: number
        }
        Insert: {
          createdAt?: string
          id: string
          profileId: string
          status?: Database["public"]["Enums"]["PurchaseStatus"]
          totalAmount: number
        }
        Update: {
          createdAt?: string
          id?: string
          profileId?: string
          status?: Database["public"]["Enums"]["PurchaseStatus"]
          totalAmount?: number
        }
        Relationships: [
          {
            foreignKeyName: "Purchase_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Ticket: {
        Row: {
          id: string
          issuedAt: string
          profileId: string
          qrCodeId: string
          status: Database["public"]["Enums"]["TicketStatus"]
          ticketTypeId: string
        }
        Insert: {
          id: string
          issuedAt?: string
          profileId: string
          qrCodeId: string
          status?: Database["public"]["Enums"]["TicketStatus"]
          ticketTypeId: string
        }
        Update: {
          id?: string
          issuedAt?: string
          profileId?: string
          qrCodeId?: string
          status?: Database["public"]["Enums"]["TicketStatus"]
          ticketTypeId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Ticket_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Ticket_ticketTypeId_fkey"
            columns: ["ticketTypeId"]
            isOneToOne: false
            referencedRelation: "TicketType"
            referencedColumns: ["id"]
          },
        ]
      }
      TicketType: {
        Row: {
          createdAt: string
          description: string | null
          eventId: string
          id: string
          name: string
          price: number
          quantity: number
        }
        Insert: {
          createdAt?: string
          description?: string | null
          eventId: string
          id: string
          name: string
          price: number
          quantity: number
        }
        Update: {
          createdAt?: string
          description?: string | null
          eventId?: string
          id?: string
          name?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "TicketType_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      EventStatus:
        | "DRAFT"
        | "ACTIVE"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
      PurchaseStatus: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED"
      TicketStatus: "UNUSED" | "USED" | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

