import { Enums } from "../enums"
import { Json } from "../helpers"

export type Evaluations = {
  Row: {
    created_at: string
    evaluation_date: string
    evaluation_type: string
    evaluator_id: string
    id: string
    observations: string | null
    patient_id: string
    protocol_used: string | null
    recommendations: string | null
    results: Json | null
    specialty: Enums["specialty"]
    status: string | null
    updated_at: string
  }
  Insert: {
    created_at?: string
    evaluation_date: string
    evaluation_type: string
    evaluator_id: string
    id?: string
    observations?: string | null
    patient_id: string
    protocol_used?: string | null
    recommendations?: string | null
    results?: Json | null
    specialty: Enums["specialty"]
    status?: string | null
    updated_at?: string
  }
  Update: {
    created_at?: string
    evaluation_date?: string
    evaluation_type?: string
    evaluator_id?: string
    id?: string
    observations?: string | null
    patient_id?: string
    protocol_used?: string | null
    recommendations?: string | null
    results?: Json | null
    specialty?: Enums["specialty"]
    status?: string | null
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "evaluations_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
  ]
}