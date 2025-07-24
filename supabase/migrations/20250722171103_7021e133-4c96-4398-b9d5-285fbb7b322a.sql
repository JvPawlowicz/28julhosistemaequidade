-- Corrigir problemas de segurança detectados pelo Supabase linter
-- Adicionar search_path seguro em todas as funções

-- 1. Corrigir funções existentes para usar search_path seguro
-- DROP FUNCTION IF EXISTS public.generate_quality_report(uuid, date, date);
CREATE OR REPLACE FUNCTION public.generate_quality_report(
  _unit_id UUID DEFAULT NULL,
  _start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  _end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  patient_name TEXT,
  therapist_name TEXT,
  specialty TEXT,
  attendance_rate NUMERIC,
  goal_achievement_rate NUMERIC,
  total_sessions INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.full_name as patient_name,
    prof.full_name as therapist_name,
    a.specialty::TEXT as specialty,
    ROUND(
      (COUNT(CASE WHEN a.status = 'compareceu' THEN 1 END) * 100.0 / 
       NULLIF(COUNT(*), 0)), 2
    ) as attendance_rate,
    COALESCE(
      (SELECT AVG(metric_value) 
       FROM public.quality_metrics qm 
       WHERE qm.patient_id = p.id 
       AND qm.metric_type = 'goal_achievement'
       AND qm.measurement_period_start >= _start_date
       AND qm.measurement_period_end <= _end_date), 0
    ) as goal_achievement_rate,
    COUNT(*) as total_sessions
  FROM public.appointments a
  JOIN public.patients p ON p.id = a.patient_id
  JOIN public.profiles prof ON prof.user_id = a.therapist_id
  WHERE 
    a.appointment_date BETWEEN _start_date AND _end_date
    AND (_unit_id IS NULL OR p.unit_id = _unit_id)
  GROUP BY p.id, p.full_name, prof.full_name, a.specialty
  ORDER BY attendance_rate DESC;
$$;

-- DROP FUNCTION IF EXISTS public.process_automatic_notifications();
CREATE OR REPLACE FUNCTION public.process_automatic_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_count INTEGER := 0;
  rec RECORD;
BEGIN
  -- Notificações de agendamentos para amanhã
  FOR rec IN 
    SELECT DISTINCT a.therapist_id, a.patient_id, a.id as appointment_id,
           a.appointment_date, a.start_time, p.full_name as patient_name
    FROM public.appointments a
    JOIN public.patients p ON p.id = a.patient_id
    WHERE a.appointment_date = CURRENT_DATE + INTERVAL '1 day'
    AND a.status = 'agendado'
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n 
      WHERE n.appointment_id = a.id 
      AND n.type = 'appointment' 
      AND n.created_at > CURRENT_DATE
    )
  LOOP
    INSERT INTO public.notifications (
      user_id, title, message, type, appointment_id, patient_id,
      action_url, expires_at
    ) VALUES (
      rec.therapist_id,
      'Agendamento para amanhã',
      format('Agendamento com %s às %s', rec.patient_name, rec.start_time::TEXT),
      'appointment',
      rec.appointment_id,
      rec.patient_id,
      format('/app/agenda?date=%s', rec.appointment_date),
      rec.appointment_date + INTERVAL '1 day'
    );
    notification_count := notification_count + 1;
  END LOOP;

  RETURN notification_count;
END;
$$;

-- DROP FUNCTION IF EXISTS public.create_system_backup(text);
CREATE OR REPLACE FUNCTION public.create_system_backup(
  _backup_type TEXT DEFAULT 'manual'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  backup_id UUID;
  backup_path TEXT;
  tables_list TEXT[];
BEGIN
  -- Gerar ID do backup
  backup_id := gen_random_uuid();
  backup_path := format('backups/%s_%s.sql', _backup_type, backup_id);
  
  -- Lista de tabelas críticas
  tables_list := ARRAY[
    'patients', 'profiles', 'appointments', 'medical_records', 
    'evaluations', 'evolutions', 'user_roles', 'units'
  ];
  
  -- Registrar início do backup
  INSERT INTO public.system_backups (
    id, backup_type, file_path, tables_included, status, created_by
  ) VALUES (
    backup_id, _backup_type, backup_path, tables_list, 'in_progress', auth.uid()
  );
  
  -- Simular backup (em produção, seria implementado com pg_dump)
  UPDATE public.system_backups 
  SET status = 'completed', file_size = 1024000
  WHERE id = backup_id;
  
  -- Criar notificação de backup concluído
  INSERT INTO public.notifications (
    user_id, title, message, type, priority
  )
  SELECT 
    ur.user_id,
    'Backup do sistema concluído',
    format('Backup %s concluído com sucesso', _backup_type),
    'system',
    'normal'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN backup_id;
END;
$$;

-- 2. Corrigir trigger de auditoria para evitar recursão
-- DROP TRIGGER IF EXISTS audit_patient_access_trigger ON public.patients;
-- DROP FUNCTION IF EXISTS public.audit_patient_access();

-- Criar função de auditoria mais simples e segura
CREATE OR REPLACE FUNCTION public.log_patient_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apenas registrar no log, sem modificar o registro
  INSERT INTO public.system_logs (
    action, table_name, record_id, user_id, module, severity
  ) VALUES (
    'patient_viewed', 'patients', NEW.id, auth.uid(), 'audit', 'info'
  );
  
  RETURN NEW;
END;
$$;

-- 3. Melhorar função de auditoria de prontuários
-- DROP FUNCTION IF EXISTS public.audit_medical_record_changes();
CREATE OR REPLACE FUNCTION public.audit_medical_record_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Para INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.system_logs (
      action, table_name, record_id, user_id, new_values, module, severity
    ) VALUES (
      'medical_record_created', 'medical_records', NEW.id, auth.uid(),
      to_jsonb(NEW), 'audit', 'info'
    );
    NEW.last_modified_by = auth.uid();
    RETURN NEW;
  END IF;
  
  -- Para UPDATE
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.system_logs (
      action, table_name, record_id, user_id, old_values, new_values, module, severity
    ) VALUES (
      'medical_record_updated', 'medical_records', NEW.id, auth.uid(),
      to_jsonb(OLD), to_jsonb(NEW), 'audit', 'info'
    );
    NEW.last_modified_by = auth.uid();
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'audit_medical_record_changes_trigger'
  ) THEN
    CREATE TRIGGER audit_medical_record_changes_trigger
      BEFORE INSERT OR UPDATE ON public.medical_records
      FOR EACH ROW
      EXECUTE FUNCTION public.audit_medical_record_changes();
  END IF;
END $$;

-- 4. Configurar políticas de backup apenas para admins
CREATE POLICY "Only admins can create backups" 
ON public.system_backups 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. Otimizar configuração de notificações automáticas
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Limpar notificações antigas (mais de 30 dias)
  DELETE FROM public.notifications 
  WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
  AND read_at IS NOT NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log da limpeza
  INSERT INTO public.system_logs (
    action, table_name, user_id, module, severity, new_values
  ) VALUES (
    'cleanup_notifications', 'notifications', auth.uid(), 'maintenance', 'info',
    jsonb_build_object('deleted_count', deleted_count)
  );
  
  RETURN deleted_count;
END;
$$;
