-- Adicionar valor 'compareceu' ao enum appointment_status de forma segura
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
