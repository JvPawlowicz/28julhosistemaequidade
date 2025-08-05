export type PatientGuardians = {
  Row: {
    created_at: string
    guardian_id: string
    id: string
    is_primary: boolean | null
    patient_id: string
    relationship: string
  }
  Insert: {
    created_at?: string
    guardian_id: string
    id?: string
    is_primary?: boolean | null
    patient_id: string
    relationship: string
  }
  Update: {
    created_at?: string
    guardian_id?: string
    id?: string
    is_primary?: boolean | null
    patient_id?: string
    relationship?: string
  }
  Relationships: [
    {
      foreignKeyName: "patient_guardians_guardian_id_fkey"
      columns: ["guardian_id"]
      isOneToOne: false
      referencedRelation: "guardians"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "patient_guardians_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}