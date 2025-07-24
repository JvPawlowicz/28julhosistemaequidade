-- Corrigir problemas de segurança detectados

-- 1. Corrigir search_path nas funções para segurança
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_unit(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT unit_id
  FROM public.profiles
  WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 2. Adicionar policies para a tabela evaluations que estava sem políticas
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view evaluations from their unit' AND tablename = 'evaluations') THEN
    CREATE POLICY "Users can view evaluations from their unit" 
    ON public.evaluations 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = evaluations.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      ) OR has_role(auth.uid(), 'admin'::app_role)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Evaluators can create their own evaluations' AND tablename = 'evaluations') THEN
    CREATE POLICY "Evaluators can create their own evaluations" 
    ON public.evaluations 
    FOR INSERT 
    WITH CHECK (
      evaluator_id = auth.uid() AND
      EXISTS (
        SELECT 1 FROM patients p
        WHERE p.id = evaluations.patient_id
        AND p.unit_id = get_user_unit(auth.uid())
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Evaluators can update their own evaluations' AND tablename = 'evaluations') THEN
    CREATE POLICY "Evaluators can update their own evaluations" 
    ON public.evaluations 
    FOR UPDATE 
    USING (evaluator_id = auth.uid());
  END IF;
END $$;