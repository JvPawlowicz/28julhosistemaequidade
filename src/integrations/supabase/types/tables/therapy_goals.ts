export type TherapyGoals = {
  Row: {
    achieved_date: string | null
    assigned_therapist_id: string | null
    created_at: string
    current_level: number | null
    goal_category: string
    goal_description: string
    id: string
    patient_id: string
    priority_level: number | null
    progress_percentage: number | null
    protocol_assessment_id: string | null
    start_date: string
    status: string
    target_criteria: string | null
    target_date: string | null
    target_level: number
    updated_at: string
  }
  Insert: {
    achieved_date?: string | null
    assigned_therapist_id?: string | null
    created_at?: string
    current_level?: number | null
    goal_category: string
    goal_description: string
    id?: string
    patient_id: string
    priority_level?: number | null
    progress_percentage?: number | null
    protocol_assessment_id?: string | null
    start_date: string
    status?: string
    target_criteria?: string | null
    target_date?: string | null
    target_level: number
    updated_at?: string
  }
  Update: {
    achieved_date?: string | null
    assigned_therapist_id?: string | null
    created_at?: string
    current_level?: number | null
    goal_category?: string
    goal_description?: string
    id?: string
    patient_id?: string
    priority_level?: number | null
    progress_percentage?: number | null
    protocol_assessment_id?: string | null
    start_date?: string
    status?: string
    target_criteria?: string | null
    target_date?: string | null
    target_level?: number
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "therapy_goals_assigned_therapist_id_fkey"
      columns: ["assigned_therapist_id"]
      isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "therapy_goals_patient_id_fkey"
      columns: ["patient_id"]
      isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "therapy_goals_protocol_assessment_id_fkey"
      columns: ["protocol_assessment_id"]
      isOneToOne: false
      referencedRelation: "protocol_assessments"
      referencedColumns: ["id"]
    },
  ]
}