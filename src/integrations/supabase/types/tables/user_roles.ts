import { Enums } from "../enums"

export type UserRoles = {
  Row: {
    created_at: string
    id: string
    role: Enums["app_role"]
    specialty: Enums["specialty"] | null
    unit_id: string | null
    user_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    role: Enums["app_role"]
    specialty?: Enums["specialty"] | null
    unit_id?: string | null
    user_id: string
  }
  Update: {
    created_at?: string
    id?: string
    role?: Enums["app_role"]
    specialty?: Enums["specialty"] | null
    unit_id?: string | null
    user_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "user_roles_unit_id_fkey"
      columns: ["unit_id"]
      isOneToOne: false
      referencedRelation: "units"
      referencedColumns: ["id"]
    },
  ]
}