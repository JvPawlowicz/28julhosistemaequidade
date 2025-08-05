export type RealtimeDataCollection = {
  Row: {
    created_at: string
    data_type: string
    device_id: string | null
    id: string
    is_synced: boolean | null
    notes: string | null
    patient_id: string
    recorded_value: number | null
    session_id: string | null
    target_behavior: string
    therapist_id: string
    timestamp: string
    unit: string | null
  }
  Insert: {
    created_at?: string
    data_type: string
    device_id?: string | null
    id?: string
    is_synced?: boolean | null
    notes?: string | null
    patient_id: string
    recorded_value?: number | null
    session_id?: string | null
    target_behavior: string
    therapist_id: string
    timestamp?: string
    unit?: string | null
  }
  Update: {
    created_at?: string
    data_type?: string
    device_id?: string | null
    id?: string
    is_synced?: boolean | null
    notes?: string | null
    patient_id?: string
    recorded_value?: number | null
    session_id?: string | null
    target_behavior?: string
    therapist_id?: string
    timestamp?: string
    unit?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "realtime_data_collection_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "realtime_data_collection_therapist_id_fkey"
      columns: ["therapist_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
  ]
}