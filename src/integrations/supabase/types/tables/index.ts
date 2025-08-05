import { Enums } from "../enums"
import { Json } from "../helpers"

// Individual Table Type Definitions
type AbaProtocols = {
  Row: { created_at: string; description: string | null; domains: Json; id: string; is_active: boolean | null; name: string; scoring_system: Json; updated_at: string; version: string | null }
  Insert: { created_at?: string; description?: string | null; domains: Json; id?: string; is_active?: boolean | null; name: string; scoring_system: Json; updated_at?: string; version?: string | null }
  Update: { created_at?: string; description?: string | null; domains?: Json; id?: string; is_active?: boolean | null; name?: string; scoring_system?: Json; updated_at?: string; version?: string | null }
  Relationships: []
}
type Appointments = {
  Row: { appointment_date: string; checked_in_at: string | null; created_at: string; end_time: string; id: string; notes: string | null; patient_id: string; room_id: string | null; specialty: Enums["specialty"]; start_time: string; status: Enums["appointment_status"] | null; therapist_id: string; unit_id: string; updated_at: string }
  Insert: { appointment_date: string; checked_in_at?: string | null; created_at?: string; end_time: string; id?: string; notes?: string | null; patient_id: string; room_id?: string | null; specialty: Enums["specialty"]; start_time: string; status?: Enums["appointment_status"] | null; therapist_id: string; unit_id: string; updated_at?: string }
  Update: { appointment_date?: string; checked_in_at?: string | null; created_at?: string; end_time?: string; id?: string; notes?: string | null; patient_id?: string; room_id?: string | null; specialty?: Enums["specialty"]; start_time?: string; status?: Enums["appointment_status"] | null; therapist_id?: string; unit_id?: string; updated_at?: string }
  Relationships: [{ foreignKeyName: "appointments_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }, { foreignKeyName: "appointments_room_id_fkey"; columns: ["room_id"]; isOneToOne: false; referencedRelation: "rooms"; referencedColumns: ["id"] }, { foreignKeyName: "appointments_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
}
type Evaluations = {
  Row: { created_at: string; evaluation_date: string; evaluation_type: string; evaluator_id: string; id: string; observations: string | null; patient_id: string; protocol_used: string | null; recommendations: string | null; results: Json | null; specialty: Enums["specialty"]; status: string | null; updated_at: string }
  Insert: { created_at?: string; evaluation_date: string; evaluation_type: string; evaluator_id: string; id?: string; observations?: string | null; patient_id: string; protocol_used?: string | null; recommendations?: string | null; results?: Json | null; specialty: Enums["specialty"]; status?: string | null; updated_at?: string }
  Update: { created_at?: string; evaluation_date?: string; evaluation_type?: string; evaluator_id?: string; id?: string; observations?: string | null; patient_id?: string; protocol_used?: string | null; recommendations?: string | null; results?: Json | null; specialty?: Enums["specialty"]; status?: string | null; updated_at?: string }
  Relationships: [{ foreignKeyName: "evaluations_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type Evolutions = {
  Row: { appointment_id: string; attachments: string[] | null; content: Json | null; created_at: string; id: string; linked_pti_objectives: string[] | null; patient_id: string; professional_id: string; signed_at: string | null; status: Enums["evolution_status"]; supervisors_signature: Json | null; updated_at: string }
  Insert: { appointment_id: string; attachments?: string[] | null; content?: Json | null; created_at?: string; id?: string; linked_pti_objectives?: string[] | null; patient_id: string; professional_id: string; signed_at?: string | null; status?: Enums["evolution_status"]; supervisors_signature?: Json | null; updated_at?: string }
  Update: { appointment_id?: string; attachments?: string[] | null; content?: Json | null; created_at?: string; id?: string; linked_pti_objectives?: string[] | null; patient_id?: string; professional_id?: string; signed_at?: string | null; status?: Enums["evolution_status"]; supervisors_signature?: Json | null; updated_at?: string }
  Relationships: [{ foreignKeyName: "evolutions_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: true; referencedRelation: "appointments"; referencedColumns: ["id"] }, { foreignKeyName: "evolutions_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }, { foreignKeyName: "evolutions_professional_id_fkey"; columns: ["professional_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
}
type Guardians = {
  Row: { address: string | null; birth_date: string; cpf: string; created_at: string; email: string | null; full_name: string; id: string; phone: string | null; relationship: string | null; updated_at: string; user_id: string | null }
  Insert: { address?: string | null; birth_date: string; cpf: string; created_at?: string; email?: string | null; full_name: string; id?: string; phone?: string | null; relationship?: string | null; updated_at?: string; user_id?: string | null }
  Update: { address?: string | null; birth_date?: string; cpf?: string; created_at?: string; email?: string | null; full_name?: string; id?: string; phone?: string | null; relationship?: string | null; updated_at?: string; user_id?: string | null }
  Relationships: [{ foreignKeyName: "guardians_user_id_fkey"; columns: ["user_id"]; isOneToOne: true; referencedRelation: "users"; referencedColumns: ["id"] }]
}
type InsurancePlans = {
  Row: { code: string | null; contact_person: string | null; created_at: string; email: string | null; id: string; is_active: boolean | null; name: string; phone: string | null; updated_at: string }
  Insert: { code?: string | null; contact_person?: string | null; created_at?: string; email?: string | null; id?: string; is_active?: boolean | null; name: string; phone?: string | null; updated_at?: string }
  Update: { code?: string | null; contact_person?: string | null; created_at?: string; email?: string | null; id?: string; is_active?: boolean | null; name?: string; phone?: string | null; updated_at?: string }
  Relationships: []
}
type MedicalRecords = {
  Row: { appointment_id: string | null; content: string; created_at: string; id: string; patient_id: string; record_type: string | null; specialty: Enums["specialty"]; therapist_id: string; updated_at: string }
  Insert: { appointment_id?: string | null; content: string; created_at?: string; id?: string; patient_id: string; record_type?: string | null; specialty: Enums["specialty"]; therapist_id: string; updated_at?: string }
  Update: { appointment_id?: string | null; content?: string; created_at?: string; id?: string; patient_id?: string; record_type?: string | null; specialty?: Enums["specialty"]; therapist_id?: string; updated_at?: string }
  Relationships: [{ foreignKeyName: "medical_records_appointment_id_fkey"; columns: ["appointment_id"]; isOneToOne: false; referencedRelation: "appointments"; referencedColumns: ["id"] }, { foreignKeyName: "medical_records_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type PatientAuthorizations = {
  Row: { authorization_number: string | null; created_at: string; end_date: string | null; id: string; insurance_plan_id: string; is_active: boolean | null; patient_id: string; sessions_authorized: number | null; sessions_used: number | null; specialty: Enums["specialty"]; start_date: string | null; updated_at: string }
  Insert: { authorization_number?: string | null; created_at?: string; end_date?: string | null; id?: string; insurance_plan_id: string; is_active?: boolean | null; patient_id: string; sessions_authorized?: number | null; sessions_used?: number | null; specialty: Enums["specialty"]; start_date?: string | null; updated_at?: string }
  Update: { authorization_number?: string | null; created_at?: string; end_date?: string | null; id?: string; insurance_plan_id?: string; is_active?: boolean | null; patient_id?: string; sessions_authorized?: number | null; sessions_used?: number | null; specialty?: Enums["specialty"]; start_date?: string | null; updated_at?: string }
  Relationships: [{ foreignKeyName: "patient_authorizations_insurance_plan_id_fkey"; columns: ["insurance_plan_id"]; isOneToOne: false; referencedRelation: "insurance_plans"; referencedColumns: ["id"] }, { foreignKeyName: "patient_authorizations_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type PatientDocuments = {
  Row: { created_at: string; description: string | null; document_type: string | null; file_name: string; file_path: string; file_size: number | null; file_type: string | null; id: string; patient_id: string; uploader_id: string }
  Insert: { created_at?: string; description?: string | null; document_type?: string | null; file_name: string; file_path: string; file_size?: number | null; file_type?: string | null; id?: string; patient_id: string; uploader_id: string }
  Update: { created_at?: string; description?: string | null; document_type?: string | null; file_name?: string; file_path?: string; file_size?: number | null; file_type?: string | null; id?: string; patient_id?: string; uploader_id?: string }
  Relationships: [{ foreignKeyName: "patient_documents_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type PatientGuardians = {
  Row: { created_at: string; guardian_id: string; id: string; is_primary: boolean | null; patient_id: string; relationship: string }
  Insert: { created_at?: string; guardian_id: string; id?: string; is_primary?: boolean | null; patient_id: string; relationship: string }
  Update: { created_at?: string; guardian_id?: string; id?: string; is_primary?: boolean | null; patient_id?: string; relationship?: string }
  Relationships: [{ foreignKeyName: "patient_guardians_guardian_id_fkey"; columns: ["guardian_id"]; isOneToOne: false; referencedRelation: "guardians"; referencedColumns: ["id"] }, { foreignKeyName: "patient_guardians_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type Patients = {
  Row: { address: string | null; birth_date: string; cpf: string | null; created_at: string; diagnosis: string | null; full_name: string; grade: string | null; id: string; observations: string | null; phone: string | null; primary_guardian_id: string | null; rg: string | null; school: string | null; status: string | null; unit_id: string | null; updated_at: string }
  Insert: { address?: string | null; birth_date: string; cpf?: string | null; created_at?: string; diagnosis?: string | null; full_name: string; grade?: string | null; id?: string; observations?: string | null; phone?: string | null; primary_guardian_id?: string | null; rg?: string | null; school?: string | null; status?: string | null; unit_id?: string | null; updated_at?: string }
  Update: { address?: string | null; birth_date?: string; cpf?: string | null; created_at?: string; diagnosis?: string | null; full_name?: string; grade?: string | null; id?: string; observations?: string | null; phone?: string | null; primary_guardian_id?: string | null; rg?: string | null; school?: string | null; status?: string | null; unit_id?: string | null; updated_at?: string }
  Relationships: [{ foreignKeyName: "patients_primary_guardian_id_fkey"; columns: ["primary_guardian_id"]; isOneToOne: false; referencedRelation: "guardians"; referencedColumns: ["id"] }, { foreignKeyName: "patients_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
}
type Profiles = {
  Row: { avatar_url: string | null; birth_date: string | null; council_number: string | null; council_type: string | null; cpf: string | null; created_at: string; email: string; full_name: string; id: string; phone: string | null; requires_supervision: boolean | null; status: Enums["user_status"] | null; unit_id: string | null; updated_at: string; user_id: string }
  Insert: { avatar_url?: string | null; birth_date?: string | null; council_number?: string | null; council_type?: string | null; cpf?: string | null; created_at?: string; email: string; full_name: string; id?: string; phone?: string | null; requires_supervision?: boolean | null; status?: Enums["user_status"] | null; unit_id?: string | null; updated_at?: string; user_id: string }
  Update: { avatar_url?: string | null; birth_date?: string | null; council_number?: string | null; council_type?: string | null; cpf?: string | null; created_at?: string; email?: string; full_name?: string; id?: string; phone?: string | null; requires_supervision?: boolean | null; status?: Enums["user_status"] | null; unit_id?: string | null; updated_at?: string; user_id?: string }
  Relationships: [{ foreignKeyName: "profiles_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
}
type ProtocolAssessments = {
  Row: { assessment_date: string; created_at: string; evaluator_id: string; id: string; next_goals: Json | null; observations: string | null; patient_id: string; protocol_id: string; recommendations: string | null; scores: Json | null; status: string; updated_at: string }
  Insert: { assessment_date: string; created_at?: string; evaluator_id: string; id?: string; next_goals?: Json | null; observations?: string | null; patient_id: string; protocol_id: string; recommendations?: string | null; scores?: Json | null; status?: string; updated_at?: string }
  Update: { assessment_date?: string; created_at?: string; evaluator_id?: string; id?: string; next_goals?: Json | null; observations?: string | null; patient_id?: string; protocol_id?: string; recommendations?: string | null; scores?: Json | null; status?: string; updated_at?: string }
  Relationships: [{ foreignKeyName: "protocol_assessments_evaluator_id_fkey"; columns: ["evaluator_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }, { foreignKeyName: "protocol_assessments_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }, { foreignKeyName: "protocol_assessments_protocol_id_fkey"; columns: ["protocol_id"]; isOneToOne: false; referencedRelation: "aba_protocols"; referencedColumns: ["id"] }]
}
type RealtimeDataCollection = {
  Row: { created_at: string; data_type: string; device_id: string | null; id: string; is_synced: boolean | null; notes: string | null; patient_id: string; recorded_value: number | null; session_id: string | null; target_behavior: string; therapist_id: string; timestamp: string; unit: string | null }
  Insert: { created_at?: string; data_type: string; device_id?: string | null; id?: string; is_synced?: boolean | null; notes?: string | null; patient_id: string; recorded_value?: number | null; session_id?: string | null; target_behavior: string; therapist_id: string; timestamp?: string; unit?: string | null }
  Update: { created_at?: string; data_type?: string; device_id?: string | null; id?: string; is_synced?: boolean | null; notes?: string | null; patient_id?: string; recorded_value?: number | null; session_id?: string | null; target_behavior?: string; therapist_id?: string; timestamp?: string; unit?: string | null }
  Relationships: [{ foreignKeyName: "realtime_data_collection_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }, { foreignKeyName: "realtime_data_collection_therapist_id_fkey"; columns: ["therapist_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
}
type Rooms = {
  Row: { created_at: string; id: string; is_active: boolean | null; name: string; unit_id: string }
  Insert: { created_at?: string; id?: string; is_active?: boolean | null; name: string; unit_id: string }
  Update: { created_at?: string; id?: string; is_active?: boolean | null; name?: string; unit_id?: string }
  Relationships: [{ foreignKeyName: "rooms_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
}
type Screenings = {
  Row: { chief_complaint: string; created_at: string; guardian_cpf: string; guardian_name: string; guardian_phone: string | null; id: string; patient_birth_date: string; patient_id: string | null; patient_name: string; screener_id: string | null; screening_data: Json | null; screening_date: string; specialty_requested: Enums["specialty"]; status: string | null; updated_at: string }
  Insert: { chief_complaint: string; created_at?: string; guardian_cpf: string; guardian_name: string; guardian_phone?: string | null; id?: string; patient_birth_date: string; patient_id?: string | null; patient_name: string; screener_id?: string | null; screening_data?: Json | null; screening_date: string; specialty_requested: Enums["specialty"]; status?: string | null; updated_at?: string }
  Update: { chief_complaint?: string; created_at?: string; guardian_cpf?: string; guardian_name?: string; guardian_phone?: string | null; id?: string; patient_birth_date?: string; patient_id?: string | null; patient_name?: string; screener_id?: string | null; screening_data?: Json | null; screening_date?: string; specialty_requested?: Enums["specialty"]; status?: string | null; updated_at?: string }
  Relationships: [{ foreignKeyName: "screenings_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }]
}
type SystemLogs = {
  Row: { action: string; created_at: string; id: string; ip_address: string | null; new_values: Json | null; old_values: Json | null; record_id: string | null; table_name: string | null; user_agent: string | null; user_id: string | null }
  Insert: { action: string; created_at?: string; id?: string; ip_address?: string | null; new_values?: Json | null; old_values?: Json | null; record_id?: string | null; table_name?: string | null; user_agent?: string | null; user_id?: string | null }
  Update: { action?: string; created_at?: string; id?: string; ip_address?: string | null; new_values?: Json | null; old_values?: Json | null; record_id?: string | null; table_name?: string | null; user_agent?: string | null; user_id?: string | null }
  Relationships: []
}
type TherapyGoals = {
  Row: { achieved_date: string | null; assigned_therapist_id: string | null; created_at: string; current_level: number | null; goal_category: string; goal_description: string; id: string; patient_id: string; priority_level: number | null; progress_percentage: number | null; protocol_assessment_id: string | null; start_date: string; status: string; target_criteria: string | null; target_date: string | null; target_level: number; updated_at: string }
  Insert: { achieved_date?: string | null; assigned_therapist_id?: string | null; created_at?: string; current_level?: number | null; goal_category: string; goal_description: string; id?: string; patient_id: string; priority_level?: number | null; progress_percentage?: number | null; protocol_assessment_id?: string | null; start_date: string; status?: string; target_criteria?: string | null; target_date?: string | null; target_level: number; updated_at?: string }
  Update: { achieved_date?: string | null; assigned_therapist_id?: string | null; created_at?: string; current_level?: number | null; goal_category?: string; goal_description?: string; id?: string; patient_id?: string; priority_level?: number | null; progress_percentage?: number | null; protocol_assessment_id?: string | null; start_date?: string; status?: string; target_criteria?: string | null; target_date?: string | null; target_level?: number; updated_at?: string }
  Relationships: [{ foreignKeyName: "therapy_goals_assigned_therapist_id_fkey"; columns: ["assigned_therapist_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }, { foreignKeyName: "therapy_goals_patient_id_fkey"; columns: ["patient_id"]; isOneToOne: false; referencedRelation: "patients"; referencedColumns: ["id"] }, { foreignKeyName: "therapy_goals_protocol_assessment_id_fkey"; columns: ["protocol_assessment_id"]; isOneToOne: false; referencedRelation: "protocol_assessments"; referencedColumns: ["id"] }]
}
type Units = {
  Row: { address: string | null; created_at: string; email: string | null; id: string; name: string; phone: string | null; updated_at: string }
  Insert: { address?: string | null; created_at?: string; email?: string | null; id?: string; name: string; phone?: string | null; updated_at?: string }
  Update: { address?: string | null; created_at?: string; email?: string | null; id?: string; name?: string; phone?: string | null; updated_at?: string }
  Relationships: []
}
type UserRoles = {
  Row: { created_at: string; id: string; role: Enums["app_role"]; specialty: Enums["specialty"] | null; unit_id: string | null; user_id: string }
  Insert: { created_at?: string; id?: string; role: Enums["app_role"]; specialty?: Enums["specialty"] | null; unit_id?: string | null; user_id: string }
  Update: { created_at?: string; id?: string; role?: Enums["app_role"]; specialty?: Enums["specialty"] | null; unit_id?: string | null; user_id?: string }
  Relationships: [{ foreignKeyName: "user_roles_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
}

// Main Tables export
export type Tables = {
  aba_protocols: AbaProtocols
  appointments: Appointments
  evaluations: Evaluations
  evolutions: Evolutions
  guardians: Guardians
  insurance_plans: InsurancePlans
  medical_records: MedicalRecords
  patient_authorizations: PatientAuthorizations
  patient_documents: PatientDocuments
  patient_guardians: PatientGuardians
  patients: Patients
  profiles: Profiles
  protocol_assessments: ProtocolAssessments
  realtime_data_collection: RealtimeDataCollection
  rooms: Rooms
  screenings: Screenings
  system_logs: SystemLogs
  therapy_goals: TherapyGoals
  units: Units
  user_roles: UserRoles
}