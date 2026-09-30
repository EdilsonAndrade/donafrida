# Tasks: Projeto base Dona Frida (perfumes e bijuterias)

**Input**: specs/001-projeto-base-perfumes/ (plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md)
**Linear**: EDI-115
**Tests**: ajustar a suíte Vitest herdada aos novos modelos e cobrir `calcularCustoProduto`, validação e encomenda (padrão do projeto).

## Phase 1: Setup

- [X] T001 Copiar voxelasduo-app para C:\projects\donafrida sem .git, node_modules, .next, segredos e specs antigas; `git init` na branch do EDI-115
- [X] T002 Recriar .mcp.json só com o Linear e apontar CLAUDE.md e AGENTS.md para specs/001-projeto-base-perfumes/plan.md
- [X] T003 [P] Renomear o pacote para `donafrida-app` em package.json e reescrever o README.md para Dona Frida
- [X] T004 [P] Reescrever .env.example para as contas da Dona Frida (MongoDB, Blob, Mercado Pago, Mercado Livre, Shopee, Google OAuth, Resend, NextAuth admin/cliente, Cron, SITE_URL, e-mails da loja) sem valores

## Phase 2: Foundational

- [X] T005 `DB_NAME = "donafrida"` em lib/db/mongodb.ts; chaves `donafrida-carrinho` em lib/carrinho/carrinho.ts e `donafrida-theme` em components/ThemeToggle.tsx e app/layout.tsx
- [X] T006 [P] Trocar domínio e e-mails padrão em lib/site/url.ts, lib/pedidos/externos.ts, lib/email/templates.ts e lib/email/resend.ts (remetente "Dona Frida", sem endereços da Voxelas)

## Phase 3: US1 - Custo e preço de produto revendido (P1) 🎯 MVP

- [X] T007 [US1] Substituir `CustoProducao` por `CustoProduto`/`ItemAdicionalCusto` em lib/models/produto.ts (campo `custoProduto`)
- [X] T008 [US1] Criar lib/produtos/custoProduto.ts (`calcularCustoProduto`) e lib/produtos/custoProduto.test.ts; remover lib/produtos/custoProducao.ts e seus testes
- [X] T009 [US1] Criar lib/produtos/custoProdutoFormulario.ts (valores em reais ↔ centavos, lista de itens) substituindo custoProducaoFormulario.ts; ajustar lib/produtos/produtoFormulario.ts
- [X] T010 [US1] Validar `custoProduto` (≥ 0, até 10 itens, nome 1–60) em lib/produtos/validation.ts e nos testes
- [X] T011 [US1] Remover `calcularPrecoEscala` de lib/produtos/precificacao.ts (+ testes) e o modo escala, a depreciação e o lucro por hora de components/admin/SimuladorPrecificacao.tsx
- [X] T012 [US1] Reescrever a seção de custo de components/admin/ProdutoForm.tsx: compra, embalagem, lista de itens (adicionar/remover), detalhamento e total; usar o custo em "copiar custo de outro produto" e duplicar
- [X] T013 [US1] Usar `custoProduto` em app/api/produtos/route.ts e app/api/produtos/[id]/mercado-livre/promocoes/route.ts (+ testes)

## Phase 4: US2 - Marca Dona Frida em todo o site (P1)

- [X] T014 [US2] app/layout.tsx: metadata Dona Frida, remover o widget de chat e o preconnect se não for mais usado
- [X] T015 [P] [US2] Marca textual no lugar do logo em components/SiteHeader.tsx (+ CSS), app/admin/(painel)/layout.tsx e components/admin/LoginForm.tsx
- [X] T016 [P] [US2] Títulos "— Dona Frida" em app/(loja)/*/page.tsx e app/global-error.tsx
- [X] T017 [P] [US2] Telas de erro e 404 sem a ilustração 3D: remover components/erro/VoxelsErro.tsx e ajustar components/erro/PaginaErro.tsx e app/not-found.tsx
- [X] T018 [P] [US2] Textos do catálogo em app/produtos/page.tsx e app/produtos/[categoria]/page.tsx; placeholders 3D no admin (ProdutoForm, CategoriaMercadoLivreSelect, TendenciasBusca, SecaoHomeForm)
- [X] T019 [US2] E-mails: cabeçalho textual Dona Frida (sem logo da Voxelas) em lib/email/templates.ts; textos em lib/email/resend.ts
- [X] T020 [P] [US2] Remover as imagens da Voxelas de public/images
- [X] T021 [P] [US2] Seed com perfumes e bijuterias de exemplo em scripts/seed.ts

## Phase 5: US3 - Ficha técnica de perfume e bijuteria (P2)

- [X] T022 [US3] Nova `FichaTecnicaProduto` em lib/models/produto.ts, lib/produtos/fichaTecnicaFormulario.ts e lib/produtos/validation.ts (+ testes)
- [X] T023 [US3] Seção de ficha técnica em components/admin/ProdutoForm.tsx (selects de gênero e banho)
- [X] T024 [US3] Criar components/produtos/FichaTecnica.tsx e exibir em app/produtos/[categoria]/[slug]/page.tsx só com os campos preenchidos
- [X] T025 [US3] Atributos do Mercado Livre em lib/estoque/canais/mercadoLivre/atributos.ts (BRAND/MODEL/GENDER/UNIT_VOLUME/MATERIAL; sem CABLE_COLOR) (+ testes)
- [X] T026 [P] [US3] Feed da Meta: marca da ficha (fallback "Dona Frida") e gênero em lib/produtos/feedMeta.ts (+ testes)

## Phase 6: US4 - Encomenda em quantidade (P2)

- [X] T027 [US4] Modelo e validação: `produtoId?`, `produtoNome?`, `quantidade`, observações condicionais em lib/models/encomenda.ts e lib/encomendas/validacao.ts (+ testes)
- [X] T028 [US4] app/api/encomendas/route.ts: validar o produto, gravar o snapshot do nome e responder 400 conforme o contrato (+ testes)
- [X] T029 [US4] Formulário com select de produto (pré-selecionado por `?produto=`) e quantidade em components/encomendas/FormularioEncomenda.tsx e app/encomendas/page.tsx; textos da faixa em components/encomendas/FaixaEncomendas.tsx
- [X] T030 [US4] Link "Encomendar" na página do produto em app/produtos/[categoria]/[slug]/page.tsx
- [X] T031 [US4] E-mails de encomenda com produto e quantidade em lib/email/resend.ts

## Phase 7: US5 - Configuração com as contas novas (P1)

- [X] T032 [US5] Conferir que nenhuma credencial foi copiada (varredura) e que .gitignore cobre .env.local e os arquivos de conta

## Phase 8: Polish

- [X] T033 Rodar `npx tsc --noEmit` e `npx vitest run` e corrigir o que falhar
- [X] T034 Varredura final: `grep -rniE "voxelas|3d|impress|filamento"` em app, components, lib e scripts sem ocorrências visíveis
- [X] T035 Atualizar quickstart.md (Test Guide) se algo mudar

## Dependencies
Setup → Foundational → US1 (MVP) → US2 → US3 → US4 → US5 → Polish. US3 e US1 tocam ProdutoForm e validation, então rodam em sequência.

## Implementation Strategy
MVP = US1 + US2 (a loja não pode ter 3D nem a marca antiga). Depois US3, US4, US5 e Polish.
