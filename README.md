# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d3304abf-8b3e-47c7-9590-8f5c9bdc8617

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d3304abf-8b3e-47c7-9590-8f5c9bdc8617) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d3304abf-8b3e-47c7-9590-8f5c9bdc8617) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Equidade - Deploy e Produção

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```
VITE_SUPABASE_URL= # URL do seu projeto Supabase
VITE_SUPABASE_ANON_KEY= # Chave anon do Supabase
```

## Build e Deploy

1. Instale dependências:
   ```bash
   npm install
   ```
2. Rode o build de produção:
   ```bash
   npm run build
   ```
3. Teste localmente:
   ```bash
   npm run preview
   ```
4. Faça o deploy do conteúdo da pasta `dist/` em seu serviço de hospedagem (Vercel, Netlify, etc).

## Segurança Supabase
- Certifique-se de que as policies (RLS) estão restritivas para produção.
- Não exponha a service key no frontend.
- Ajuste a policy de SELECT em `guardians` para permitir apenas login, não listagem geral.

## Testes Finais
- Teste login de profissionais e responsáveis.
- Teste navegação, permissões e logout.
- Teste em diferentes navegadores e dispositivos.

## Backup
- Faça backup do banco e das migrations antes de alterações em produção.

## Monitoramento (opcional)
- Configure logs e monitoramento de erros se desejar.

---

Pronto para produção!
# sistemaequidadev1
# sistemaequidadev1
# equidademaisv1
# equidademaisv1
