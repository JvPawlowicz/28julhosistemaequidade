# Deploy Equidade: Vercel + Supabase (Checklist Específico)

## ✅ Etapas já concluídas
- [x] Conta criada no Supabase e Vercel
- [x] Projeto Supabase criado e configurado
- [x] Todas as migrations aplicadas e banco sincronizado
- [x] Policies de segurança revisadas e ajustadas para produção
- [x] Projeto local atualizado e funcionando
- [x] Build de produção gerado com sucesso (`npm run build`)
- [x] Variáveis de ambiente corretas no `.env` local:
  - `VITE_SUPABASE_URL=https://xqpuvuqsyxknljeonlnw.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [x] Teste local do build (`npm run preview`) realizado

## ⏳ Etapas pendentes para deploy final
1. **Subir o projeto para o GitHub**
   - Se ainda não subiu, rode:
     ```bash
     git init
     git add .
     git commit -m "Deploy Equidade pronto para produção"
     git branch -M main
     git remote add origin <URL_DO_SEU_REPO>
     git push -u origin main
     ```

2. **Deploy na Vercel**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Clique em “Import Git Repository” e selecione seu repositório
   - Siga os passos até a tela de variáveis de ambiente
   - Adicione:
     - `VITE_SUPABASE_URL` (cole o Project URL do Supabase)
     - `VITE_SUPABASE_ANON_KEY` (cole a anon key do Supabase)
   - Clique em “Deploy”

3. **Validação final em produção**
   - Aguarde o deploy terminar
   - Acesse a URL gerada pela Vercel (ex: `https://seu-projeto.vercel.app`)
   - Faça login como profissional e responsável, teste navegação, permissões e logout
   - Se necessário, ajuste policies no Supabase para produção

4. **(Opcional) Configurar domínio próprio e monitoramento**
   - Configure domínio no painel da Vercel se desejar
   - Ative Vercel Analytics ou integre Sentry/LogRocket para monitoramento

---

**Após concluir as etapas pendentes, seu sistema estará online, seguro e pronto para uso real!**

Se precisar de exemplos de configuração, comandos prontos ou quiser automatizar algum passo, peça ajuda!
