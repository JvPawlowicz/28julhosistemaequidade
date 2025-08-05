import { Enums } from "../enums"
import { Json } from "../helpers"

export type Evolutions = {
  Row: {
    appointment_id: string
    attachments: string[] | null
    content: Json | null
    created_at: string
    id: string
    linked_pti_objectives: string[] | null
    patient_id: string
    professional_id: string
    signed_at: string | null
    status: Enums["evolution_status"]
    supervisors_signature: Json | null
    updated_at: string
  }
  Insert: {
    appointment_id: string
    attachments?: string[] | null
    content?: Json | null
    created_at?: string
    id?: string
    linked_pti_objectives?: string[] | null
    patient_id: string
    professional_id: string
    signed_at?: string | null
    status?: Enums["evolution_status"]
    supervisors_signature?: Json | null
    updated_at?: string
  }
  Update: {
    appointment_id?: string
    attachments?: string[] | null
    content?: Json | null
    created_at?: string
    id?: string
    linked_pti_objectives?: string[] | null
    patient_id?: string
    professional_id?: string
    signed_at?: string | null
    status?: Enums["evolution_status"]
    supervisors_signature?: Json | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "evolutions_appointment_id_fkey"
      columns: ["appointment_id"]
      isOneToOne: true
      referencedRelation: "appointments"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "evolutions_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "evolutions_professional_id_fkey"
      columns: ["professional_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
  ]
}