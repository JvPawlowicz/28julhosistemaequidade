-- Criar tipo enum para status de evolução
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'evolution_status'
  ) THEN
    CREATE TYPE evolution_status AS ENUM ('Rascunho', 'Pendente de Supervisão', 'Finalizada');
  END IF;
END $$;

-- Criar tabela de evoluções
CREATE TABLE IF NOT EXISTS public.evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  professional_id UUID NOT NULL REFERENCES public.profiles(id),
  appointment_id UUID UNIQUE NOT NULL REFERENCES public.appointments(id),
  status evolution_status NOT NULL DEFAULT 'Rascunho',
  content JSONB, -- Objeto: { "inappropriate_behavior": boolean, "behavior_description": "...", "session_report": "..." }
  linked_pti_objectives UUID[], -- Array de IDs dos objetivos do PTI
  attachments TEXT[], -- Array de URLs de arquivos do Supabase Storage
  signed_at TIMESTAMPTZ,
  supervisors_signature JSONB, -- Objeto: { "supervisor_id", "approved_at" }
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela evolutions
ALTER TABLE public.evolutions ENABLE ROW LEVEL SECURITY;

-- Política: Terapeutas podem criar e editar seus próprios rascunhos
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can manage own evolutions' AND tablename = 'evolutions') THEN
    CREATE POLICY "Therapists can manage own evolutions" 
    ON public.evolutions 
    FOR ALL 
    USING (professional_id = auth.uid() AND status = 'Rascunho');
  END IF;
END $$;

-- Política: Terapeutas podem visualizar suas próprias evoluções finalizadas
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can view own finished evolutions' AND tablename = 'evolutions') THEN
    CREATE POLICY "Therapists can view own finished evolutions" 
    ON public.evolutions 
    FOR SELECT 
    USING (professional_id = auth.uid());
  END IF;
END $$;

-- Política: Coordenadores podem visualizar e gerenciar evoluções de sua unidade
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Coordinators can manage unit evolutions' AND tablename = 'evolutions') THEN
    CREATE POLICY "Coordinators can manage unit evolutions" 
    ON public.evolutions 
    FOR ALL 
    USING (
      has_role(auth.uid(), 'coordenador'::app_role) AND 
      EXISTS (
        SELECT 1 FROM public.profiles p1, public.profiles p2 
        WHERE p1.user_id = auth.uid() 
        AND p2.user_id = professional_id 
        AND p1.unit_id = p2.unit_id
      )
    );
  END IF;
END $$;

-- Política: Admins podem visualizar todas as evoluções
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all evolutions' AND tablename = 'evolutions') THEN
    CREATE POLICY "Admins can view all evolutions" 
    ON public.evolutions 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Política: Coordenadores podem atualizar status de supervisão
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Coordinators can update supervision status' AND tablename = 'evolutions') THEN
    CREATE POLICY "Coordinators can update supervision status" 
    ON public.evolutions 
    FOR UPDATE 
    USING (
      has_role(auth.uid(), 'coordenador'::app_role) AND
      status = 'Pendente de Supervisão' AND
      EXISTS (
        SELECT 1 FROM public.profiles p1, public.profiles p2 
        WHERE p1.user_id = auth.uid() 
        AND p2.user_id = professional_id 
        AND p1.unit_id = p2.unit_id
      )
    );
  END IF;
END $$;

-- Trigger para atualizar updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_evolutions_updated_at'
  ) THEN
    CREATE TRIGGER update_evolutions_updated_at
      BEFORE UPDATE ON public.evolutions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;