import { Enums } from "../enums"

export type PatientAuthorizations = {
  Row: {
    authorization_number: string | null
    created_at: string
    end_date: string | null
    id: string
    insurance_plan_id: string
    is_active: boolean | null
    patient_id: string
    sessions_authorized: number | null
    sessions_used: number | null
    specialty: Enums["specialty"]
    start_date: string | null
    updated_at: string
  }
  Insert: {
    authorization_number?: string | null
    created_at?: string
    end_date?: string | null
    id?: string
    insurance_plan_id: string
    is_active?: boolean | null
    patient_id: string
    sessions_authorized?: number | null
    sessions_used?: number | null
    specialty: Enums["specialty"]
    start_date?: string | null
    updated_at?: string
  }
  Update: {
    authorization_number?: string | null
    created_at?: string
    end_date?: string | null
    id?: string
    insurance_plan_id?: string
    is_active?: boolean | null
    patient_id?: string
    sessions_authorized?: number | null
    sessions_used?: number | null
    specialty?: Enums["specialty"]
    start_date?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "patient_authorizations_insurance_plan_id_fkey"
      columns: ["insurance_plan_id"]
      isOneToOne: false
      referencedRelation: "insurance_plans"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "patient_authorizations_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}