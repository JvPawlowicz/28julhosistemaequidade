import { Json } from "../helpers"

export type SystemLogs = {
  Row: {
    action: string
    created_at: string
    id: string
    ip_address: string | null
    new_values: Json | null
    old_values: Json | null
    record_id: string | null
    table_name: string | null
    user_agent: string | null
    user_id: string | null
  }
  Insert: {
    action: string
    created_at?: string
    id?: string
    ip_address?: string | null
    new_values?: Json | null
    old_values?: Json | null
    record_id?: string | null
    table_name?: string | null
    user_agent?: string | null
    user_id?: string | null
  }
  Update: {
    action?: string
    created_at?: string
    id?: string
    ip_address?: string | null
    new_values?: Json | null
    old_values?: Json | null
    record_id?: string | null
    table_name?: string | null
    user_agent?: string | null
    user_id?: string | null
  }
  Relationships: []
}