# Dona Frida

Loja online de perfumes e bijuterias: Next.js (App Router) + MongoDB Atlas, hospedada na Vercel. Vende no site (Mercado Pago), no Mercado Livre, na Shopee e no catálogo do Facebook/Instagram.

## Setup local

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha as chaves das contas da Dona Frida (cada uma tem a explicação de onde obter).
3. `npm run seed:admin` para criar o usuário do painel. Opcional: `npm run seed` para carregar perfumes e bijuterias de exemplo.
4. `npm run dev` e acesse `http://localhost:3000`. O painel fica em `/admin`.

## Estrutura

- `app/`: páginas e rotas de API (App Router)
- `app/admin/`: painel (produtos, banners da home, pedidos, atendimento, tendências, taxas)
- `lib/`: regras de negócio, repositórios MongoDB e integrações (Mercado Pago, Mercado Livre, Shopee, Meta, Resend)
- `specs/`: especificações por funcionalidade (spec-kit)

## Deploy

Projeto próprio na Vercel, com as variáveis do `.env.example` cadastradas em Settings → Environment Variables. O Blob store é conectado pelo painel da Vercel (gera o `BLOB_READ_WRITE_TOKEN`).
