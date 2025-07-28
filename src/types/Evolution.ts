export interface EvolutionContent {
  inappropriate_behavior?: boolean;
  behavior_description?: string;
  session_report?: string;
  supervision_feedback?: string;
  // outros campos dinâmicos podem ser string | boolean | undefined
  [key: string]: string | boolean | undefined;
}

export interface Evolution {
  id: string;
  appointment_id: string;
  attachments: string[];
  content: EvolutionContent;
  created_at: string;
  patient_id: string;
  professional_id: string;
  signed_at: string;
  status: string;
  supervisors_signature?: string;
  updated_at: string;
  profiles?: {
    full_name: string;
  };
}
