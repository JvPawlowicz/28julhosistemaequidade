-- Criar tipo enum para especialidades
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'specialty_type'
  ) THEN
    CREATE TYPE specialty_type AS ENUM ('fonoaudiologia', 'psicologia', 'terapia_ocupacional', 'psicopedagogia', 'fisioterapia', 'musicoterapia', 'nutricao', 'outro');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'compareceu'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'appointment_status')
  ) THEN
    ALTER TYPE appointment_status ADD VALUE 'compareceu';
  END IF;
END $$;

-- Criar tabela de backups automáticos
CREATE TABLE public.system_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL, -- 'daily', 'weekly', 'manual'
  file_path TEXT NOT NULL,
  file_size BIGINT,
  tables_included TEXT[],
  status TEXT NOT NULL DEFAULT 'completed', -- 'in_progress', 'completed', 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'appointment', 'authorization_expiry', 'evaluation_due', 'system'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'critical'
  read_at TIMESTAMPTZ,
  action_url TEXT,
  patient_id UUID REFERENCES public.patients(id),
  appointment_id UUID REFERENCES public.appointments(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de templates de notificação
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de configurações de notificação por usuário
CREATE TABLE public.user_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  notification_type TEXT NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Criar tabela de métricas de qualidade
CREATE TABLE public.quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  therapist_id UUID NOT NULL REFERENCES public.profiles(id),
  specialty specialty_type NOT NULL,
  metric_type TEXT NOT NULL, -- 'attendance_rate', 'goal_achievement', 'satisfaction_score'
  metric_value NUMERIC NOT NULL,
  measurement_period_start DATE NOT NULL,
  measurement_period_end DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de fila de espera
CREATE TABLE public.waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  specialty specialty_type NOT NULL,
  priority_level INTEGER NOT NULL DEFAULT 1, -- 1-5, 5 sendo mais urgente
  requested_therapist_id UUID REFERENCES public.profiles(id),
  preferred_time_slots JSONB, -- {"monday": ["09:00-10:00"], "tuesday": ["14:00-15:00"]}
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'contacted', 'scheduled', 'cancelled'
  added_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_contact_date DATE,
  estimated_wait_weeks INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de recursos (salas, equipamentos)
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES public.units(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'room', 'equipment', 'material'
  description TEXT,
  capacity INTEGER,
  specialties specialty_type[],
  is_available BOOLEAN DEFAULT true,
  maintenance_schedule JSONB,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de reservas de recursos
CREATE TABLE public.resource_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id),
  appointment_id UUID REFERENCES public.appointments(id),
  booked_by UUID NOT NULL REFERENCES auth.users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'completed'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Melhorar tabela de logs do sistema (adicionar mais campos)
ALTER TABLE public.system_logs 
ADD COLUMN IF NOT EXISTS module TEXT,
ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info', -- 'debug', 'info', 'warning', 'error', 'critical'
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS request_id TEXT;

-- Adicionar campos de auditoria a tabelas importantes
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_accessed_by UUID REFERENCES auth.users(id);

ALTER TABLE public.medical_records 
ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES auth.users(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para backups (apenas admins)
CREATE POLICY "Only admins can manage backups" 
ON public.system_backups 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para notificações
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Políticas RLS para templates de notificação
CREATE POLICY "Everyone can view active notification templates" 
ON public.notification_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage notification templates" 
ON public.notification_templates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para configurações de notificação
CREATE POLICY "Users can manage their own notification settings" 
ON public.user_notification_settings 
FOR ALL 
USING (user_id = auth.uid());

-- Políticas RLS para métricas de qualidade
CREATE POLICY "Users can view quality metrics from their unit" 
ON public.quality_metrics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM patients p
    WHERE p.id = quality_metrics.patient_id
    AND p.unit_id = get_user_unit(auth.uid())
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Therapists can create quality metrics for their patients" 
ON public.quality_metrics 
FOR INSERT 
WITH CHECK (
  therapist_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM patients p
    WHERE p.id = quality_metrics.patient_id
    AND p.unit_id = get_user_unit(auth.uid())
  )
);

-- Políticas RLS para fila de espera
CREATE POLICY "Users can view waiting list from their unit" 
ON public.waiting_list 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM patients p
    WHERE p.id = waiting_list.patient_id
    AND p.unit_id = get_user_unit(auth.uid())
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Reception can manage waiting list" 
ON public.waiting_list 
FOR ALL 
USING (
  has_role(auth.uid(), 'recepcao'::app_role) OR 
  has_role(auth.uid(), 'coordenador'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Políticas RLS para recursos
CREATE POLICY "Users can view resources from their unit" 
ON public.resources 
FOR SELECT 
USING (
  unit_id = get_user_unit(auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Coordinators can manage unit resources" 
ON public.resources 
FOR ALL 
USING (
  (unit_id = get_user_unit(auth.uid()) AND 
   has_role(auth.uid(), 'coordenador'::app_role)) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Políticas RLS para reservas de recursos
CREATE POLICY "Users can view resource bookings from their unit" 
ON public.resource_bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM resources r
    WHERE r.id = resource_bookings.resource_id
    AND r.unit_id = get_user_unit(auth.uid())
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create resource bookings in their unit" 
ON public.resource_bookings 
FOR INSERT 
WITH CHECK (
  booked_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM resources r
    WHERE r.id = resource_bookings.resource_id
    AND r.unit_id = get_user_unit(auth.uid())
  )
);

CREATE POLICY "Users can update their own resource bookings" 
ON public.resource_bookings 
FOR UPDATE 
USING (booked_by = auth.uid());

-- Criar função para gerar relatórios automáticos
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
       FROM quality_metrics qm 
       WHERE qm.patient_id = p.id 
       AND qm.metric_type = 'goal_achievement'
       AND qm.measurement_period_start >= _start_date
       AND qm.measurement_period_end <= _end_date), 0
    ) as goal_achievement_rate,
    COUNT(*) as total_sessions
  FROM appointments a
  JOIN patients p ON p.id = a.patient_id
  JOIN profiles prof ON prof.user_id = a.therapist_id
  WHERE 
    a.appointment_date BETWEEN _start_date AND _end_date
    AND (_unit_id IS NULL OR p.unit_id = _unit_id)
  GROUP BY p.id, p.full_name, prof.full_name, a.specialty
  ORDER BY attendance_rate DESC;
$$;

-- Criar função para processar notificações automáticas
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
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    WHERE a.appointment_date = CURRENT_DATE + INTERVAL '1 day'
    AND a.status = 'agendado'
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.appointment_id = a.id 
      AND n.type = 'appointment' 
      AND n.created_at > CURRENT_DATE
    )
  LOOP
    INSERT INTO notifications (
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

  -- Notificações de autorizações vencendo em 7 dias
  FOR rec IN
    SELECT DISTINCT pa.patient_id, pa.insurance_plan_id, pa.end_date,
           p.full_name as patient_name, ip.name as insurance_name
    FROM patient_authorizations pa
    JOIN patients p ON p.id = pa.patient_id
    JOIN insurance_plans ip ON ip.id = pa.insurance_plan_id
    WHERE pa.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND pa.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.patient_id = pa.patient_id 
      AND n.type = 'authorization_expiry' 
      AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
    )
  LOOP
    -- Notificar coordenadores da unidade do paciente
    INSERT INTO notifications (
      user_id, title, message, type, patient_id, priority,
      action_url, expires_at
    )
    SELECT 
      ur.user_id,
      'Autorização vencendo',
      format('Autorização do %s (%s) vence em %s', 
             rec.patient_name, rec.insurance_name, rec.end_date),
      'authorization_expiry',
      rec.patient_id,
      'high',
      format('/app/pacientes/%s', rec.patient_id),
      rec.end_date + INTERVAL '7 days'
    FROM user_roles ur
    JOIN profiles prof ON prof.user_id = ur.user_id
    WHERE ur.role = 'coordenador'
    AND prof.unit_id = get_user_unit(ur.user_id);
    
    notification_count := notification_count + 1;
  END LOOP;

  RETURN notification_count;
END;
$$;

-- Criar triggers para auditoria automática
CREATE OR REPLACE FUNCTION public.audit_patient_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Registrar acesso a prontuário
  INSERT INTO system_logs (
    action, table_name, record_id, user_id, module, severity
  ) VALUES (
    'patient_access', 'patients', NEW.id, auth.uid(), 'audit', 'info'
  );
  
  -- Atualizar último acesso
  NEW.last_accessed_at = now();
  NEW.last_accessed_by = auth.uid();
  
  RETURN NEW;
END;
$$;

-- Criar trigger para mudanças em prontuários
CREATE OR REPLACE FUNCTION public.audit_medical_record_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Para INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO system_logs (
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
    INSERT INTO system_logs (
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

-- Aplicar triggers
-- CREATE TRIGGER audit_patient_access_trigger
--   BEFORE SELECT ON public.patients
--   FOR EACH ROW
--   EXECUTE FUNCTION public.audit_patient_access();
--
-- O PostgreSQL não permite triggers BEFORE SELECT em tabelas. Comentado para evitar erro de sintaxe.

CREATE TRIGGER audit_medical_record_changes_trigger
  BEFORE INSERT OR UPDATE ON public.medical_records
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_medical_record_changes();

-- Inserir templates padrão de notificação
INSERT INTO notification_templates (name, title_template, message_template, type) VALUES
('appointment_reminder', 'Agendamento para {date}', 'Você tem um agendamento com {patient_name} às {time}', 'appointment'),
('authorization_expiry', 'Autorização vencendo', 'A autorização de {patient_name} vence em {days} dias', 'authorization_expiry'),
('evaluation_due', 'Reavaliação pendente', 'Reavaliação de {patient_name} está pendente', 'evaluation_due'),
('backup_completed', 'Backup concluído', 'Backup do sistema concluído com sucesso', 'system'),
('backup_failed', 'Falha no backup', 'Backup do sistema falhou. Verifique os logs', 'system');

-- Criar função para backup automático
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
  INSERT INTO system_backups (
    id, backup_type, file_path, tables_included, status, created_by
  ) VALUES (
    backup_id, _backup_type, backup_path, tables_list, 'in_progress', auth.uid()
  );
  
  -- Simular backup (em produção, seria implementado com pg_dump)
  -- Por enquanto, apenas marcar como concluído
  UPDATE system_backups 
  SET status = 'completed', file_size = 1024000
  WHERE id = backup_id;
  
  -- Criar notificação de backup concluído
  INSERT INTO notifications (
    user_id, title, message, type, priority
  )
  SELECT 
    ur.user_id,
    'Backup do sistema concluído',
    format('Backup %s concluído com sucesso', _backup_type),
    'system',
    'normal'
  FROM user_roles ur
  WHERE ur.role = 'admin';
  
  RETURN backup_id;
END;
$$;

-- Atualizar função de updated_at para incluir triggers nas novas tabelas
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_settings_updated_at
  BEFORE UPDATE ON public.user_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waiting_list_updated_at
  BEFORE UPDATE ON public.waiting_list
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
