-- Adicionar apenas as policies que estavam faltando para evaluations
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