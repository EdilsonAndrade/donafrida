# Implementation Plan: Projeto base Dona Frida (perfumes e bijuterias)

**Branch**: `edilsonaandrade/edi-115-criar-projeto-dona-frida-a-partir-do-voxelas-duo` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md) | **Linear**: EDI-115

## Summary
Código copiado do voxelasduo-app (sem `.git`, segredos, `node_modules` e specs antigas) e adaptado para revenda:
- `CustoProducao` (3D) → `CustoProduto` (compra + embalagem + `itensAdicionais[]`), com o simulador sem o modo "escala".
- Ficha técnica de perfume e bijuteria, exibida na página do produto e mapeada para atributos do Mercado Livre e da Meta.
- Encomendas com produto e quantidade.
- Marca Dona Frida em todo texto, e-mail e metadado; widget de chat removido.
- Base `donafrida` e `.env.example` revisado.

## Technical Context
- **Stack herdada**: TypeScript, Next.js 16.3 (App Router), React 19, CSS Modules, MongoDB 6.12, Vercel Blob, NextAuth v5, Mercado Pago, Resend, Vitest. **Sem dependência nova.**
- **Banco**: `DB_NAME = "donafrida"`, com a base começando vazia (sem migração).
- **i18n**: pt-BR inline (i18n fica fora do escopo, ver a spec).
- **Visual**: tokens e fontes atuais mantidos (redesign no EDI-116). Logos trocados por placeholder textual.
- **Testes**: suíte Vitest herdada, ajustada aos novos modelos, mais testes para `calcularCustoProduto`, validação e encomenda.

## Constitution Check
`constitution.md` é o template, sem princípios ratificados. Aplicamos as regras do CLAUDE.md:
- Erros da API com status HTTP real, visíveis na aba Network.
- Nada de commit; apenas sugerir a mensagem.
- Não subir servidor para testar; entregar Test Guide.
- Sem credenciais no código (FR-016).
✅ Sem violações.

## Project Structure (arquivos afetados)
```text
lib/models/produto.ts                      # CustoProducao→CustoProduto; FichaTecnicaProduto nova
lib/produtos/custoProduto.ts (+test)       # novo — substitui custoProducao.ts (removido)
lib/produtos/custoProdutoFormulario.ts     # novo — substitui custoProducaoFormulario.ts
lib/produtos/fichaTecnicaFormulario.ts     # campos de perfume/bijuteria
lib/produtos/validation.ts (+test)         # valida custoProduto e a nova ficha
lib/produtos/produtoFormulario.ts          # usa os novos formulários
lib/produtos/feedMeta.ts                   # marca vem da ficha (fallback "Dona Frida"); gênero
lib/produtos/precificacao.ts               # remove calcularPrecoEscala
lib/estoque/canais/mercadoLivre/atributos.ts  # BRAND/MODEL/GENDER/UNIT_VOLUME…; sem CABLE_COLOR
app/api/produtos/route.ts, [id]/mercado-livre/promocoes/route.ts   # custoProduto
components/admin/ProdutoForm.tsx           # seção de custo e ficha nova
components/admin/SimuladorPrecificacao.tsx # sem modo escala / depreciação / lucro por hora
components/produtos/FichaTecnica.tsx       # novo — exibição na página do produto
app/produtos/[categoria]/[slug]/page.tsx   # ficha + link "Encomendar"

lib/models/encomenda.ts, lib/encomendas/*  # produtoId?, produtoNome?, quantidade
app/api/encomendas/route.ts, app/encomendas/page.tsx, components/encomendas/*
lib/email/resend.ts, lib/email/templates.ts   # marca e textos da encomenda

app/layout.tsx                             # metadata, sem widget, chave de tema
components/SiteHeader.tsx, app/admin/(painel)/layout.tsx, components/admin/LoginForm.tsx
app/(loja)/*/page.tsx, app/global-error.tsx, app/not-found.tsx, components/erro/*
app/produtos/page.tsx, app/produtos/[categoria]/page.tsx   # textos
lib/db/mongodb.ts, lib/carrinho/carrinho.ts, components/ThemeToggle.tsx, lib/site/url.ts, lib/pedidos/externos.ts
public/images/*                            # remove logos Voxelas; placeholder
scripts/seed.ts                            # perfumes/bijuterias de exemplo
package.json, README.md, .env.example, .mcp.json, CLAUDE.md, AGENTS.md
```

## Phases
- **Phase 0**: [research.md](./research.md)
- **Phase 1**: [data-model.md](./data-model.md) · [contracts/encomendas-api.md](./contracts/encomendas-api.md) · [quickstart.md](./quickstart.md)

## Post-design Constitution Check
✅ Mantido.
