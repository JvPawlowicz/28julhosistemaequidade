-- Adiciona a coluna user_id à tabela guardians para vincular ao sistema de autenticação
ALTER TABLE public.guardians
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Cria um índice único para garantir que um usuário de autenticação esteja ligado a apenas um responsável
CREATE UNIQUE INDEX guardians_user_id_key ON public.guardians(user_id);

-- Adiciona o novo perfil 'responsavel' ao tipo de perfis de usuário existentes no sistema
ALTER TYPE public.app_role ADD VALUE 'responsavel';

-- Políticas de Segurança de Nível de Linha (RLS) para Responsáveis

-- Permite que responsáveis visualizem seus próprios dados cadastrais
CREATE POLICY "Guardians can view their own data"
ON public.guardians FOR SELECT
USING (auth.uid() = user_id);

-- Permite que responsáveis visualizem os dados dos pacientes pelos quais são responsáveis
CREATE POLICY "Guardians can view their associated patients"
ON public.patients FOR SELECT
USING (
  id IN (
    SELECT patient_id FROM patient_guardians WHERE guardian_id IN (
      SELECT id FROM guardians WHERE user_id = auth.uid()
    )
  )
);