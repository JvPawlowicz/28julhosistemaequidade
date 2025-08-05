import { Enums } from "../enums"

export type Profiles = {
  Row: {
    avatar_url: string | null
    birth_date: string | null
    council_number: string | null
    council_type: string | null
    cpf: string | null
    created_at: string
    email: string
    full_name: string
    id: string
    phone: string | null
    requires_supervision: boolean | null
    status: Enums["user_status"] | null
    unit_id: string | null
    updated_at: string
    user_id: string
  }
  Insert: {
    avatar_url?: string | null
    birth_date?: string | null
    council_number?: string | null
    council_type?: string | null
    cpf?: string | null
    created_at?: string
    email: string
    full_name: string
    id?: string
    phone?: string | null
    requires_supervision?: boolean | null
    status?: Enums["user_status"] | null
    unit_id?: string | null
    updated_at?: string
    user_id: string
  }
  Update: {
    avatar_url?: string | null
    birth_date?: string | null
    council_number?: string | null
    council_type?: string | null
    cpf?: string | null
    created_at?: string
    email?: string
    full_name?: string
    id?: string
    phone?: string | null
    requires_supervision?: boolean | null
    status?: Enums["user_status"] | null
    unit_id?: string | null
    updated_at?: string
    user_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "profiles_unit_id_fkey"
      columns: ["unit_id"]
      isOneToOne: false
      referencedRelation: "units"
      referencedColumns: ["id"]
    },
  ]
}