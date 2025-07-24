# Checklist de Deploy Equidade

## 1. Segurança Supabase
- [x] Policies revisadas para produção (restritivas)
- [x] Nenhuma policy aberta com USING (true) em produção
- [x] Apenas anon key exposta no frontend

## 2. Variáveis de Ambiente
- [x] VITE_SUPABASE_URL
- [x] VITE_SUPABASE_ANON_KEY

## 3. Testes Finais
- [x] Testes manuais de login, navegação, permissões
- [x] Testes em dispositivos móveis e navegadores
- [x] Testes automatizados (se existirem)

## 4. Build e Deploy
- [x] Build de produção (`npm run build`)
- [x] Teste local do build (`npm run preview`)
- [x] Deploy no serviço desejado (Vercel, Netlify, etc)

## 5. Documentação
- [x] README atualizado
- [x] .env.example criado
- [x] Checklist de deploy incluso

## 6. Backup
- [x] Backup do banco e migrations

## 7. Monitoramento
- [ ] Configurar logs/monitoramento (opcional)

---

**Após seguir este checklist, o sistema está pronto para deploy seguro e profissional.**
