-- Criar tabela de protocolos ABA
CREATE TABLE IF NOT EXISTS public.aba_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT,
  description TEXT,
  domains JSONB NOT NULL, -- Array de domínios e competências
  scoring_system JSONB NOT NULL, -- Sistema de pontuação
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de avaliações de protocolo
CREATE TABLE IF NOT EXISTS public.protocol_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  protocol_id UUID NOT NULL REFERENCES public.aba_protocols(id),
  evaluator_id UUID NOT NULL REFERENCES public.profiles(id),
  assessment_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_andamento', -- em_andamento, concluido, pausado
  scores JSONB, -- Pontuações por domínio/competência
  observations TEXT,
  recommendations TEXT,
  next_goals JSONB, -- Próximas metas sugeridas
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de dados em tempo real
CREATE TABLE IF NOT EXISTS public.realtime_data_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  therapist_id UUID NOT NULL REFERENCES public.profiles(id),
  session_id UUID, -- Referência para sessão/agendamento
  data_type TEXT NOT NULL, -- frequency, duration, interval, discrete_trial
  target_behavior TEXT NOT NULL,
  recorded_value NUMERIC,
  unit TEXT, -- seconds, minutes, count, percentage
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  is_synced BOOLEAN DEFAULT false,
  device_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de metas terapêuticas (PTI expandido)
CREATE TABLE IF NOT EXISTS public.therapy_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  protocol_assessment_id UUID REFERENCES public.protocol_assessments(id),
  goal_category TEXT NOT NULL, -- communication, social, academic, behavioral
  goal_description TEXT NOT NULL,
  target_criteria TEXT, -- Critério de sucesso
  current_level NUMERIC DEFAULT 0,
  target_level NUMERIC NOT NULL,
  progress_percentage NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, achieved, paused, discontinued
  priority_level INTEGER DEFAULT 1, -- 1-5 (1 = alta prioridade)
  start_date DATE NOT NULL,
  target_date DATE,
  achieved_date DATE,
  assigned_therapist_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.aba_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_data_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_goals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Protocolos ABA - todos podem visualizar os protocolos ativos
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view active protocols' AND tablename = 'aba_protocols') THEN
    CREATE POLICY "Everyone can view active protocols" 
    ON public.aba_protocols 
    FOR SELECT 
    USING (is_active = true);
  END IF;
END $$;

-- Avaliações de protocolo - baseado na unidade do usuário
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view protocol assessments from their unit' AND tablename = 'protocol_assessments') THEN
    CREATE POLICY "Users can view protocol assessments from their unit" 
    ON public.protocol_assessments 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.patients p, public.profiles prof
        WHERE p.id = patient_id 
        AND prof.user_id = auth.uid()
        AND p.unit_id = prof.unit_id
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can manage their protocol assessments' AND tablename = 'protocol_assessments') THEN
    CREATE POLICY "Therapists can manage their protocol assessments" 
    ON public.protocol_assessments 
    FOR ALL 
    USING (evaluator_id = auth.uid());
  END IF;
END $$;

-- Coleta de dados em tempo real - apenas para o terapeuta responsável
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can manage their realtime data' AND tablename = 'realtime_data_collection') THEN
    CREATE POLICY "Therapists can manage their realtime data" 
    ON public.realtime_data_collection 
    FOR ALL 
    USING (therapist_id = auth.uid());
  END IF;
END $$;

-- Metas terapêuticas - baseado na unidade
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view therapy goals from their unit' AND tablename = 'therapy_goals') THEN
    CREATE POLICY "Users can view therapy goals from their unit" 
    ON public.therapy_goals 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.patients p, public.profiles prof
        WHERE p.id = patient_id 
        AND prof.user_id = auth.uid()
        AND p.unit_id = prof.unit_id
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Assigned therapists can manage their goals' AND tablename = 'therapy_goals') THEN
    CREATE POLICY "Assigned therapists can manage their goals" 
    ON public.therapy_goals 
    FOR ALL 
    USING (assigned_therapist_id = auth.uid());
  END IF;
END $$;

-- Triggers para updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_aba_protocols_updated_at'
  ) THEN
    CREATE TRIGGER update_aba_protocols_updated_at
      BEFORE UPDATE ON public.aba_protocols
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_protocol_assessments_updated_at'
  ) THEN
    CREATE TRIGGER update_protocol_assessments_updated_at
      BEFORE UPDATE ON public.protocol_assessments
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_therapy_goals_updated_at'
  ) THEN
    CREATE TRIGGER update_therapy_goals_updated_at
      BEFORE UPDATE ON public.therapy_goals
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Inserir protocolos padrão
INSERT INTO public.aba_protocols (name, version, description, domains, scoring_system) VALUES
('VB-MAPP', '2.0', 'Verbal Behavior Milestones Assessment and Placement Program', 
 '{
   "mand": {"description": "Requesting", "milestones": 15},
   "tact": {"description": "Labeling", "milestones": 15}, 
   "listener": {"description": "Receptive Language", "milestones": 15},
   "visual_perceptual": {"description": "Visual Perceptual Skills", "milestones": 12},
   "independent_play": {"description": "Independent Play", "milestones": 12},
   "social_behavior": {"description": "Social Behavior and Social Play", "milestones": 12},
   "motor_imitation": {"description": "Motor Imitation", "milestones": 10},
   "echoic": {"description": "Vocal Imitation", "milestones": 10},
   "spontaneous_vocal": {"description": "Spontaneous Vocal Behavior", "milestones": 10}
 }',
 '{"type": "milestone", "scale": "0-3", "criteria": {"0": "Not demonstrated", "1": "Emerging", "2": "Partial", "3": "Mastered"}}'
),
('ABLLS-R', '2.0', 'Assessment of Basic Language and Learning Skills - Revised',
 '{
   "basic_learner": {"description": "Basic Learner Skills", "tasks": 25},
   "academic": {"description": "Academic Skills", "tasks": 30},
   "self_help": {"description": "Self-Help Skills", "tasks": 20},
   "motor": {"description": "Motor Skills", "tasks": 15}
 }',
 '{"type": "task_analysis", "scale": "0-4", "criteria": {"0": "Does not demonstrate", "1": "Demonstrates with full assistance", "2": "Demonstrates with partial assistance", "3": "Demonstrates independently", "4": "Demonstrates fluently"}}'
),
('Denver', '4.0', 'Denver Developmental Screening Test',
 '{
   "personal_social": {"description": "Personal-Social", "items": 25},
   "fine_motor": {"description": "Fine Motor-Adaptive", "items": 29},
   "language": {"description": "Language", "items": 39},
   "gross_motor": {"description": "Gross Motor", "items": 31}
 }',
 '{"type": "pass_fail", "scale": "pass/fail/caution", "age_ranges": "0-72_months"}'
);