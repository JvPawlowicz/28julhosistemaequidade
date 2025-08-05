import { Enums } from "../enums"
import { Json } from "../helpers"

export type Screenings = {
  Row: {
    chief_complaint: string
    created_at: string
    guardian_cpf: string
    guardian_name: string
    guardian_phone: string | null
    id: string
    patient_birth_date: string
    patient_id: string | null
    patient_name: string
    screener_id: string | null
    screening_data: Json | null
    screening_date: string
    specialty_requested: Enums["specialty"]
    status: string | null
    updated_at: string
  }
  Insert: {
    chief_complaint: string
    created_at?: string
    guardian_cpf: string
    guardian_name: string
    guardian_phone?: string | null
    id?: string
    patient_birth_date: string
    patient_id?: string | null
    patient_name: string
    screener_id?: string | null
    screening_data?: Json | null
    screening_date: string
    specialty_requested: Enums["specialty"]
    status?: string | null
    updated_at?: string
  }
  Update: {
    chief_complaint?: string
    created_at?: string
    guardian_cpf?: string
    guardian_name?: string
    guardian_phone?: string | null
    id?: string
    patient_birth_date?: string
    patient_id?: string | null
    patient_name?: string
    screener_id?: string | null
    screening_data?: Json | null
    screening_date?: string
    specialty_requested?: Enums["specialty"]
    status?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "screenings_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}