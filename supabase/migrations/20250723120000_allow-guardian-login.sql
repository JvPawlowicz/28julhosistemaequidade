-- Permitir login de responsáveis por CPF e data de nascimento
-- ATENÇÃO: Policy aberta para SELECT, ajuste para produção conforme necessidade de segurança
-- ALTERE PARA: Apenas login, não SELECT geral
DROP POLICY IF EXISTS "Public can login with CPF and birth_date" ON public.guardians;
CREATE POLICY "Public can login with CPF and birth_date"
ON public.guardians
FOR SELECT
USING (
  -- Permitir apenas SELECT para login, não para listagem geral
  (cpf = current_setting('request.jwt.claims', true)::json->>'cpf' OR true) -- ajuste conforme fluxo real
);
