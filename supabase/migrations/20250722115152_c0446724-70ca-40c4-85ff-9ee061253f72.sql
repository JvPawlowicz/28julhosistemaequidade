-- Configurar autenticação e profiles
-- Criar trigger para criação automática de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'ativo'::user_status
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para executar a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Adicionar RLS policies para profiles que estavam faltando
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view profiles from their unit' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view profiles from their unit" 
    ON public.profiles 
    FOR SELECT 
    USING (
      unit_id = get_user_unit(auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow profile creation during signup' AND tablename = 'profiles') THEN
    CREATE POLICY "Allow profile creation during signup" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Adicionar policies para guardians
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view guardians from their unit' AND tablename = 'guardians') THEN
    CREATE POLICY "Users can view guardians from their unit" 
    ON public.guardians 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patient_guardians pg
        JOIN patients p ON p.id = pg.patient_id
        WHERE pg.guardian_id = guardians.id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para patient_guardians
ALTER TABLE public.patient_guardians ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view patient guardians from their unit' AND tablename = 'patient_guardians') THEN
    CREATE POLICY "Users can view patient guardians from their unit" 
    ON public.patient_guardians 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = patient_guardians.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para insurance_plans
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view active insurance plans' AND tablename = 'insurance_plans') THEN
    CREATE POLICY "Everyone can view active insurance plans" 
    ON public.insurance_plans 
    FOR SELECT 
    USING (is_active = true);
  END IF;
END $$;

-- Adicionar policies para patient_authorizations
ALTER TABLE public.patient_authorizations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view patient authorizations from their unit' AND tablename = 'patient_authorizations') THEN
    CREATE POLICY "Users can view patient authorizations from their unit" 
    ON public.patient_authorizations 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = patient_authorizations.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para patient_documents
ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view patient documents from their unit' AND tablename = 'patient_documents') THEN
    CREATE POLICY "Users can view patient documents from their unit" 
    ON public.patient_documents 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = patient_documents.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload patient documents to their unit' AND tablename = 'patient_documents') THEN
    CREATE POLICY "Users can upload patient documents to their unit" 
    ON public.patient_documents 
    FOR INSERT 
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = patient_documents.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) AND uploader_id = auth.uid()
    );
  END IF;
END $$;

-- Adicionar policies para medical_records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view medical records from their unit' AND tablename = 'medical_records') THEN
    CREATE POLICY "Users can view medical records from their unit" 
    ON public.medical_records 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = medical_records.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Therapists can create medical records' AND tablename = 'medical_records') THEN
    CREATE POLICY "Therapists can create medical records" 
    ON public.medical_records 
    FOR INSERT 
    WITH CHECK (
      therapist_id = auth.uid() AND
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = medical_records.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      )
    );
  END IF;
END $$;

-- Adicionar policies para screenings
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Reception can manage screenings' AND tablename = 'screenings') THEN
    CREATE POLICY "Reception can manage screenings" 
    ON public.screenings 
    FOR ALL 
    USING (
      has_role(auth.uid(), 'recepcao'::app_role) OR 
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'coordenador'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view rooms from their unit' AND tablename = 'rooms') THEN
    CREATE POLICY "Users can view rooms from their unit" 
    ON public.rooms 
    FOR SELECT 
    USING (
      unit_id = get_user_unit(auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para units
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their unit' AND tablename = 'units') THEN
    CREATE POLICY "Users can view their unit" 
    ON public.units 
    FOR SELECT 
    USING (
      id = get_user_unit(auth.uid()) OR 
      has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

-- Adicionar policies para system_logs
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can view system logs' AND tablename = 'system_logs') THEN
    CREATE POLICY "Only admins can view system logs" 
    ON public.system_logs 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;