import { Enums } from "../enums"

export type MedicalRecords = {
  Row: {
    appointment_id: string | null
    content: string
    created_at: string
    id: string
    patient_id: string
    record_type: string | null
    specialty: Enums["specialty"]
    therapist_id: string
    updated_at: string
  }
  Insert: {
    appointment_id?: string | null
    content: string
    created_at?: string
    id?: string
    patient_id: string
    record_type?: string | null
    specialty: Enums["specialty"]
    therapist_id: string
    updated_at?: string
  }
  Update: {
    appointment_id?: string | null
    content?: string
    created_at?: string
    id?: string
    patient_id?: string
    record_type?: string | null
    specialty?: Enums["specialty"]
    therapist_id?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "medical_records_appointment_id_fkey"
      columns: ["appointment_id"]
      isOneToOne: false
      referencedRelation: "appointments"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "medical_records_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}