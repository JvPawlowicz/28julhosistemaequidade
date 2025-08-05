export type Guardians = {
  Row: {
    address: string | null
    birth_date: string
    cpf: string
    created_at: string
    email: string | null
    full_name: string
    id: string
    phone: string | null
    relationship: string | null
    updated_at: string
    user_id: string | null
  }
  Insert: {
    address?: string | null
    birth_date: string
    cpf: string
    created_at?: string
    email?: string | null
    full_name: string
    id?: string
    phone?: string | null
    relationship?: string | null
    updated_at?: string
    user_id?: string | null
  }
  Update: {
    address?: string | null
    birth_date?: string
    cpf?: string
    created_at?: string
    email?: string | null
    full_name?: string
    id?: string
    phone?: string | null
    relationship?: string | null
    updated_at?: string
    user_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "guardians_user_id_fkey"
      columns: ["user_id"]
      isOneToOne: true
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
  ]
}