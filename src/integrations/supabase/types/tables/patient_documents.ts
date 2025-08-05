export type PatientDocuments = {
  Row: {
    created_at: string
    description: string | null
    document_type: string | null
    file_name: string
    file_path: string
    file_size: number | null
    file_type: string | null
    id: string
    patient_id: string
    uploader_id: string
  }
  Insert: {
    created_at?: string
    description?: string | null
    document_type?: string | null
    file_name: string
    file_path: string
    file_size?: number | null
    file_type?: string | null
    id?: string
    patient_id: string
    uploader_id: string
  }
  Update: {
    created_at?: string
    description?: string | null
    document_type?: string | null
    file_name?: string
    file_path?: string
    file_size?: number | null
    file_type?: string | null
    id?: string
    patient_id?: string
    uploader_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "patient_documents_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}