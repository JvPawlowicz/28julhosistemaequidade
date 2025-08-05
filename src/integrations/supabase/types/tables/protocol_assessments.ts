import { Json } from "../helpers"

export type ProtocolAssessments = {
  Row: {
    assessment_date: string
    created_at: string
    evaluator_id: string
    id: string
    next_goals: Json | null
    observations: string | null
    patient_id: string
    protocol_id: string
    recommendations: string | null
    scores: Json | null
    status: string
    updated_at: string
  }
  Insert: {
    assessment_date: string
    created_at?: string
    evaluator_id: string
    id?: string
    next_goals?: Json | null
    observations?: string | null
    patient_id: string
    protocol_id: string
    recommendations?: string | null
    scores?: Json | null
    status?: string
    updated_at?: string
  }
  Update: {
    assessment_date?: string
    created_at?: string
    evaluator_id?: string
    id?: string
    next_goals?: Json | null
    observations?: string | null
    patient_id?: string
    protocol_id?: string
    recommendations?: string | null
    scores?: Json | null
    status?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "protocol_assessments_evaluator_id_fkey"
      columns: ["evaluator_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "protocol_assessments_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "protocol_assessments_protocol_id_fkey"
      columns: ["protocol_id"]
      isOneToOne: false
      referencedRelation: "aba_protocols"
      referencedColumns: ["id"]
    },
  ]
}