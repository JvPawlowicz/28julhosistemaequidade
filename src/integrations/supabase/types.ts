export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aba_protocols: {
        Row: {
          created_at: string
          description: string | null
          domains: Json
          id: string
          is_active: boolean | null
          name: string
          scoring_system: Json
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          domains: Json
          id?: string
          is_active?: boolean | null
          name: string
          scoring_system: Json
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          domains?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          scoring_system?: Json
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          checked_in_at: string | null
          created_at: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          room_id: string | null
          specialty: Database["public"]["Enums"]["specialty"]
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"] | null
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
          specialty: Database["public"]["Enums"]["specialty"]
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
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
          specialty?: Database["public"]["Enums"]["specialty"]
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
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
      evaluations: {
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
          specialty: Database["public"]["Enums"]["specialty"]
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
          specialty: Database["public"]["Enums"]["specialty"]
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
          specialty?: Database["public"]["Enums"]["specialty"]
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
      evolutions: {
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
          status: Database["public"]["Enums"]["evolution_status"]
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
          status?: Database["public"]["Enums"]["evolution_status"]
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
          status?: Database["public"]["Enums"]["evolution_status"]
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
      guardians: {
        Row: {
          address: string | null
          birth_date: string
          cpf: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          relationship: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          cpf: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          cpf?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guardians_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_plans: {
        Row: {
          code: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          appointment_id: string | null
          content: string
          created_at: string
          id: string
          patient_id: string
          record_type: string | null
          specialty: Database["public"]["Enums"]["specialty"]
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
          specialty: Database["public"]["Enums"]["specialty"]
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
          specialty?: Database["public"]["Enums"]["specialty"]
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
      patient_authorizations: {
        Row: {
          authorization_number: string | null
          created_at: string
          end_date: string | null
          id: string
          insurance_plan_id: string
          is_active: boolean | null
          patient_id: string
          sessions_authorized: number | null
          sessions_used: number | null
          specialty: Database["public"]["Enums"]["specialty"]
          start_date: string | null
          updated_at: string
        }
        Insert: {
          authorization_number?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          insurance_plan_id: string
          is_active?: boolean | null
          patient_id: string
          sessions_authorized?: number | null
          sessions_used?: number | null
          specialty: Database["public"]["Enums"]["specialty"]
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          authorization_number?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          insurance_plan_id?: string
          is_active?: boolean | null
          patient_id?: string
          sessions_authorized?: number | null
          sessions_used?: number | null
          specialty?: Database["public"]["Enums"]["specialty"]
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_authorizations_insurance_plan_id_fkey"
            columns: ["insurance_plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_authorizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
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
      patient_guardians: {
        Row: {
          created_at: string
          guardian_id: string
          id: string
          is_primary: boolean | null
          patient_id: string
          relationship: string
        }
        Insert: {
          created_at?: string
          guardian_id: string
          id?: string
          is_primary?: boolean | null
          patient_id: string
          relationship: string
        }
        Update: {
          created_at?: string
          guardian_id?: string
          id?: string
          is_primary?: boolean | null
          patient_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_guardians_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_guardians_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string
          cpf: string | null
          created_at: string
          diagnosis: string | null
          full_name: string
          grade: string | null
          id: string
          observations: string | null
          phone: string | null
          primary_guardian_id: string | null
          rg: string | null
          school: string | null
          status: string | null
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date: string
          cpf?: string | null
          created_at?: string
          diagnosis?: string | null
          full_name: string
          grade?: string | null
          id?: string
          observations?: string | null
          phone?: string | null
          primary_guardian_id?: string | null
          rg?: string | null
          school?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string
          cpf?: string | null
          created_at?: string
          diagnosis?: string | null
          full_name?: string
          grade?: string | null
          id?: string
          observations?: string | null
          phone?: string | null
          primary_guardian_id?: string | null
          rg?: string | null
          school?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_primary_guardian_id_fkey"
            columns: ["primary_guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          council_number: string | null
          council_type: string | null
          cpf: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          requires_supervision: boolean | null
          status: Database["public"]["Enums"]["user_status"] | null
          unit_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          council_number?: string | null
          council_type?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          requires_supervision?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          unit_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          council_number?: string | null
          council_type?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          requires_supervision?: boolean | null
          status?: Database["public"]["Enums"]["user_status"] | null
          unit_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_assessments: {
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
      realtime_data_collection: {
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
      rooms: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          unit_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      screenings: {
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
          specialty_requested: Database["public"]["Enums"]["specialty"]
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
          specialty_requested: Database["public"]["Enums"]["specialty"]
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
          specialty_requested?: Database["public"]["Enums"]["specialty"]
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
      system_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      therapy_goals: {
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
      units: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          specialty: Database["public"]["Enums"]["specialty"] | null
          unit_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          specialty?: Database["public"]["Enums"]["specialty"] | null
          unit_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: Database["public"]["Enums"]["specialty"] | null
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_unit: {
        Args: {
          _user_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "coordenador"
        | "terapeuta"
        | "estagiario"
        | "recepcao"
        | "responsavel"
      appointment_status:
        | "agendado"
        | "confirmado"
        | "realizado"
        | "compareceu"
        | "falta"
        | "cancelado"
      evolution_status: "Rascunho" | "Pendente de Supervisão" | "Finalizada"
      specialty:
        | "psicologia"
        | "terapia_ocupacional"
        | "fonoaudiologia"
        | "fisioterapia"
        | "psicopedagogia"
        | "nutricao"
      user_status: "ativo" | "inativo" | "suspenso"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never