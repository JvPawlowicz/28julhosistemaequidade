export type InsurancePlans = {
  Row: {
    code: string | null
    contact_person: string | null
    created_at: string
    email: string | null
    id: string
    is_active: boolean | null
    name: string
    phone: string | null
    updated_at: string
  }
  Insert: {
    code?: string | null
    contact_person?: string | null
    created_at?: string
    email?: string | null
    id?: string
    is_active?: boolean | null
    name: string
    phone?: string | null
    updated_at?: string
  }
  Update: {
    code?: string | null
    contact_person?: string | null
    created_at?: string
    email?: string | null
    id?: string
    is_active?: boolean | null
    name?: string
    phone?: string | null
    updated_at?: string
  }
  Relationships: []
}