export type Patients = {
  Row: {
    address: string | null
    birth_date: string
    cpf: string | null
    created_at: string
    diagnosis: string | null
    full_name: string
    grade: string | null
    id: string
    observations: string | null
    phone: string | null
    primary_guardian_id: string | null
    rg: string | null
    school: string | null
    status: string | null
    unit_id: string | null
    updated_at: string
  }
  Insert: {
    address?: string | null
    birth_date: string
    cpf?: string | null
    created_at?: string
    diagnosis?: string | null
    full_name: string
    grade?: string | null
    id?: string
    observations?: string | null
    phone?: string | null
    primary_guardian_id?: string | null
    rg?: string | null
    school?: string | null
    status?: string | null
    unit_id?: string | null
    updated_at?: string
  }
  Update: {
    address?: string | null
    birth_date?: string
    cpf?: string | null
    created_at?: string
    diagnosis?: string | null
    full_name?: string
    grade?: string | null
    id?: string
    observations?: string | null
    phone?: string | null
    primary_guardian_id?: string | null
    rg?: string | null
    school?: string | null
    status?: string | null
    unit_id?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "patients_primary_guardian_id_fkey"
      columns: ["primary_guardian_id"]
      isOneToOne: false
      referencedRelation: "guardians"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "patients_unit_id_fkey"
      columns: ["unit_id"]
      isOneToOne: false
      referencedRelation: "units"
      referencedColumns: ["id"]
    },
  ]
}