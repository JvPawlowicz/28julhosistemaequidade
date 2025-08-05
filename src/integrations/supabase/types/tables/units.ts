export type Units = {
  Row: {
    address: string | null
    created_at: string
    email: string | null
    id: string
    name: string
    phone: string | null
    updated_at: string
  }
  Insert: {
    address?: string | null
    created_at?: string
    email?: string | null
    id?: string
    name: string
    phone?: string | null
    updated_at?: string
  }
  Update: {
    address?: string | null
    created_at?: string
    email?: string | null
    id?: string
    name?: string
    phone?: string | null
    updated_at?: string
  }
  Relationships: []
}