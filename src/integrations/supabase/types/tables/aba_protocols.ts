import { Json } from "../helpers"

export type AbaProtocols = {
  Row: {
    created_at: string
    description: string | null
    domains: Json
    id: string
    is_active: boolean | null
    name: string
    scoring_system: Json
    updated_at: string
    version: string | null
  }
  Insert: {
    created_at?: string
    description?: string | null
    domains: Json
    id?: string
    is_active?: boolean | null
    name: string
    scoring_system: Json
    updated_at?: string
    version?: string | null
  }
  Update: {
    created_at?: string
    description?: string | null
    domains?: Json
    id?: string
    is_active?: boolean | null
    name?: string
    scoring_system?: Json
    updated_at?: string
    version?: string | null
  }
  Relationships: []
}