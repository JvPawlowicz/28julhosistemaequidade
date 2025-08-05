import { Enums } from "../enums"

export type Appointments = {
  Row: {
    appointment_date: string
    checked_in_at: string | null
    created_at: string
    end_time: string
    id: string
    notes: string | null
    patient_id: string
    room_id: string | null
    specialty: Enums["specialty"]
    start_time: string
    status: Enums["appointment_status"] | null
    therapist_id: string
    unit_id: string
    updated_at: string
  }
  Insert: {
    appointment_date: string
    checked_in_at?: string | null
    created_at?: string
    end_time: string
    id?: string
    notes?: string | null
    patient_id: string
    room_id?: string | null
    specialty: Enums["specialty"]
    start_time: string
    status?: Enums["appointment_status"] | null
    therapist_id: string
    unit_id: string
    updated_at?: string
  }
  Update: {
    appointment_date?: string
    checked_in_at?: string | null
    created_at?: string
    end_time?: string
    id?: string
    notes?: string | null
    patient_id?: string
    room_id?: string | null
    specialty?: Enums["specialty"]
    start_time?: string
    status?: Enums["appointment_status"] | null
    therapist_id?: string
    unit_id?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "appointments_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "appointments_room_id_fkey"
      columns: ["room_id"]
      isOneToOne: false
      referencedRelation: "rooms"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "appointments_unit_id_fkey"
      columns: ["unit_id"]
      isOneToOne: false
      referencedRelation: "units"
      referencedColumns: ["id"]
    },
  ]
}