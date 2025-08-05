export type Rooms = {
  Row: {
    created_at: string
    id: string
    is_active: boolean | null
    name: string
    unit_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    name: string
    unit_id: string
  }
  Update: {
    created_at?: string
    id?: string
    is_active?: boolean | null
    name?: string
    unit_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "rooms_unit_id_fkey"
      columns: ["unit_id"]
      isOneToOne: false
      referencedRelation: "units"
      referencedColumns: ["id"]
    },
  ]
}