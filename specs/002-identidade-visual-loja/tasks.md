# Tasks: Identidade visual e layout da loja Dona Frida

**Feature**: EDI-116 (absorve o EDI-117) | **Data**: 2026-09-30
**Entrada**: [spec.md](./spec.md) · [plan.md](./plan.md) · [research.md](./research.md) ·
[data-model.md](./data-model.md)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo — arquivo diferente, sem dependência pendente
- **[US1..US4]**: história de usuário da spec

## Path Conventions

Caminhos relativos à raiz do repositório (`C:\projects\donafrida`).

---

## Phase 1: Setup

- [x] T001 Trocar as fontes em `app/layout.tsx`: remover o `<link>` de Baloo 2, Nunito e Caveat e carregar Bodoni Moda (400,500 + itálico) e Jost (400,500,600) pelo mesmo mecanismo de `<link>` já usado, mantendo o `preconnect`

## Phase 2: Foundational (bloqueia todas as histórias)

- [x] T002 Reescrever `app/globals.css` com os tokens semânticos do `data-model.md` §1 (cor, tipografia, `--raio`, `--raio-redondo`, `--sombra`, `--container`), tema único claro, `body` com `--fundo`/`--tinta`/`--font-body`, títulos em `--font-display`, foco visível em `--acao` e `scroll-padding-top` para o cabeçalho fixo
- [x] T003 Remover o tema escuro: apagar o bloco `:root[data-theme="dark"]` (feito em T002), apagar `components/ThemeToggle.tsx`, remover o `themeInitScript` e o `data-theme` de `app/layout.tsx`, e remover todo uso de `ThemeToggle` nas telas que o importam
- [x] T004 Aplicar a substituição mecânica de tokens do `data-model.md` §2 nos 14 arquivos `*.module.css` de `components/` (`--creme`→`--fundo`, `--surface`→`--superficie`, `--surface-line`→`--contorno`, `--preto`→`--tinta`, `--texto-soft`→`--tinta-suave`, `--roxo`→`--acao`, `--rosa`/`--laranja`→`--destaque`, `--turquesa`→`--sucesso`, `--amarelo`→`--aviso`, `--font-hand`→`--font-display`)
- [x] T005 Rodar `npx tsc --noEmit` e `npx vitest run` para confirmar que a fundação não quebrou nada antes de seguir

---

## Phase 3: User Story 1 - A loja parece a Dona Frida (P1) 🎯 MVP

**Goal**: nenhuma cor nem fonte da identidade anterior sobrevive, e todo texto atinge AA.

**Independent Test**: percorrer home, catálogo, produto, carrinho, checkout e painel e não
encontrar cor antiga, com o layout ainda funcionando.

- [x] T006 [P] [US1] Limpar os estilos arco-íris de `components/produtos/produtos.module.css` (6 ocorrências: `.hero .rainbow`, `nth-child` colorido) e redesenhar o card de produto — contorno `--contorno`, `--raio`, nome em `--font-body` 500, preço em destaque
- [x] T007 [P] [US1] Limpar os estilos arco-íris de `components/home/home.module.css` (5 ocorrências) e dar tratamento visual às seções: banner com sobreposição legível, texto de destaque centrado, seção alternada com `--fundo-rosa`
- [x] T008 [P] [US1] Limpar os estilos arco-íris de `components/encomendas/encomendas.module.css` (2 ocorrências) e revisar a sombra dura `box-shadow: 8px 8px 0`
- [x] T009 [P] [US1] Revisar `components/checkout/checkout.module.css` e `components/pagamento/pagamento.module.css`: conferir os pontos marcados como revisão manual no `data-model.md` §2 (ex-`--roxo`, ex-`--rosa` em gradiente, borda tracejada) e remover gradientes multicoloridos
- [x] T010 [P] [US1] Revisar `components/cliente/cliente.module.css` e `components/AvisoSpam.module.css` pelos mesmos critérios
- [x] T011 [US1] Auditar todos os `*.module.css` em busca de uso de `--contorno` ou `--contorno-forte` como cor de texto e de `--font-display` abaixo de 24px; corrigir cada ocorrência conforme as regras do `data-model.md` §1

---

## Phase 4: User Story 2 - Home editorial que convida a navegar (P2)

**Goal**: hero de largura total com cabeçalho transparente, seções tratadas, rodapé rosa.

**Independent Test**: com banners e carrosséis cadastrados, percorrer a home do topo ao rodapé
no desktop e a 360px.

- [x] T012 [P] [US2] Criar `components/site/FioDeContas.tsx` e `FioDeContas.module.css`: fileira de círculos em `--contorno-forte`, com variantes divisor (decorativo, `aria-hidden`) e indicador (conta atual preenchida, com rótulo acessível)
- [x] T013 [P] [US2] Criar `components/produtos/Preco.tsx`: recebe preço e preço promocional opcional; sem promocional mostra só o preço; com promocional mostra preço cheio riscado, preço novo e selo "Promoção" em `--destaque`
- [x] T014 [US2] Criar `components/site/SiteFooter.tsx` e `SiteFooter.module.css`: fundo `--fundo-rosa`, colunas Loja e Conecte-se, bloco de novidades (WhatsApp quando `NEXT_PUBLIC_LOJA_WHATSAPP` existir, senão campo desabilitado com a nota de inscrição não aberta), direitos autorais e link de termos e políticas; omitir canal não configurado sem deixar espaço vazio
- [x] T015 [US2] Incluir `SiteFooter` em `app/layout.tsx`, depois de `{children}`
- [x] T016 [US2] Criar `components/site/HeaderScroll.tsx` (cliente): marca `data-rolado` no `<html>` ao sair do topo, com listener passivo e limpeza no unmount
- [x] T017 [US2] Marcar `data-hero-topo` no elemento da primeira seção em `app/page.tsx` quando ela for `bannerHero`, e aplicar em `components/SiteHeader.module.css` a regra `:global(body:has([data-hero-topo]))` para o cabeçalho transparente, voltando a sólido com `data-rolado`
- [x] T018 [US2] Usar `FioDeContas` como divisor entre as seções da home em `app/page.tsx` e como paginação em `components/home/CarrosselProdutos.tsx` — o terceiro uso previsto (passo do checkout) **não se aplica**: o checkout é um formulário de página única, sem etapas
- [x] T019 [US2] Usar `Preco` nos cards do carrossel e do catálogo, substituindo a formatação de preço repetida

---

## Phase 5: User Story 3 - Encontrar e comprar sem sair do fluxo (P3)

**Goal**: categorias, busca, menu de conta e carrinho em painel lateral.

**Independent Test**: da home, abrir categorias, buscar, adicionar ao carrinho e chegar ao
checkout, no desktop e a 360px.

- [x] T020 [P] [US3] Criar `lib/site/navegacao.ts` com `dividirCategorias(categorias, limite = 5)` retornando `{ naBarra, noMais }`, conforme `data-model.md` §5
- [x] T021 [P] [US3] Criar `lib/site/navegacao.test.ts` cobrindo lista vazia, abaixo do limite, exatamente no limite, acima do limite e limite zero
- [x] T022 [P] [US3] Criar `components/site/BuscaHeader.tsx`: formulário com `action="/produtos"` e `name="q"`, rótulo acessível, que leva ao catálogo filtrado
- [x] T023 [P] [US3] Criar `components/site/MenuConta.tsx` (cliente): menu suspenso com Entrar e Criar conta sem sessão; Pedidos, Perfil e Sair com sessão; fecha por Esc e clique fora, navegável por teclado
- [x] T024 [US3] Criar `components/site/MenuCategorias.tsx`: consome `listarCategorias()` e `dividirCategorias()`, rende as categorias em linha e o excedente no menu "Mais"
- [x] T025 [US3] Reescrever `components/SiteHeader.tsx` e `SiteHeader.module.css`: marca à esquerda, `MenuCategorias`, e à direita `BuscaHeader`, `MenuConta` e botão do carrinho com contador; cabeçalho fixo, transparente sobre o hero, sólido ao rolar; links de admin preservados
- [x] T026 [US3] Atualizar `components/MenuMobile.tsx` para incluir as categorias e os acessos de conta, sem perder nenhum destino
- [x] T027 [US3] Criar `components/carrinho/CarrinhoDrawer.tsx` com `<dialog>` + `showModal()`: itens, subtotal, continuar comprando e finalizar; estado vazio com "Voltar à loja" e convite para entrar; `::backdrop` com a cor literal autorizada no `research.md` §7
- [x] T028 [US3] Abrir o painel ao adicionar produto ao carrinho, a partir do provedor existente em `components/carrinho/CarrinhoProvider`, e devolver o foco ao botão do carrinho ao fechar
- [x] T029 [US3] Estilizar o painel em `components/carrinho/carrinho.module.css` (entrada pela direita, largura total a 360px) e garantir que `/carrinho` e o painel leiam o mesmo estado

---

## Phase 6: User Story 4 - Painel e telas de conta na mesma identidade (P4)

**Goal**: nenhuma tela órfã com a identidade antiga.

**Independent Test**: percorrer as telas do painel, as de conta do cliente, erro e 404.

- [x] T030 [P] [US4] Revisar `components/admin/admin.module.css` (89 tokens migrados): conferir contraste de tabela, formulário, botões e barra lateral, e corrigir o que a migração deixou ilegível
- [x] T031 [P] [US4] Revisar `components/admin/secoesHome.module.css`, `ConfirmModal.module.css` e `Toast.module.css`, conferindo que erro, sucesso e aviso do Toast usam `--erro`, `--sucesso` e `--aviso`
- [x] T032 [P] [US4] Revisar `components/erro/PaginaErro.module.css`, `app/global-error.tsx` e `app/not-found.tsx` na nova identidade, mantendo o selo tipográfico da marca
- [x] T033 [P] [US4] Revisar `app/icon.svg` para a nova paleta

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T034 Verificar contraste de todas as combinações usadas contra a tabela do `research.md` §5 e corrigir o que reprovar em 4.5:1
- [x] T035 Percorrer as 26 rotas a 360px e eliminar qualquer rolagem horizontal
- [x] T036 Conferir que `prefers-reduced-motion` suprime a animação do painel do carrinho e as transições dos carrosséis
- [x] T037 Remover o código que a entrega tornou morto: `--font-hand`, restos de `data-theme`, chave `donafrida-theme` e imports órfãos
- [x] T038 Rodar `npx tsc --noEmit` e `npx vitest run` e reportar o resultado real
- [x] T039 Atualizar o `quickstart.md` com qualquer passo que tenha mudado durante a implementação

---

## Dependencies & Execution Order

### Phase Dependencies

```
Setup (T001)
   ↓
Foundational (T002–T005)  ← bloqueia tudo
   ↓
US1 (T006–T011)  ← MVP
   ↓
US2 (T012–T019) ──┐
   ↓              │  US3 usa FioDeContas e Preco de US2
US3 (T020–T029) ←─┘
   ↓
US4 (T030–T033)
   ↓
Polish (T034–T039)
```

### Within Each User Story

Componente novo → uso do componente → estilo → revisão.

### Parallel Opportunities

- **US1**: T006, T007, T008, T009, T010 são arquivos diferentes — todos em paralelo. T011 só depois.
- **US2**: T012 e T013 em paralelo. T014 depende de nada, mas T015 depende de T014; T018 depende de T012; T019 depende de T013.
- **US3**: T020, T022, T023 em paralelo; T021 depois de T020; T024 depois de T020; T025 depois de T022, T023 e T024.
- **US4**: T030, T031, T032, T033 todos em paralelo.

---

## Implementation Strategy

**MVP (US1)**: tokens, fontes e limpeza. Entregue sozinho, a loja já deixa de parecer o Voxelas
Duo, mesmo sem rodapé nem painel de carrinho.

**Entrega incremental**: cada história deixa a loja em estado utilizável. Se o tempo acabar em
US2, a vitrine já está pronta e a navegação antiga continua funcionando.

---

## Desvios registrados durante a execução

- **Fio de contas no checkout**: previsto no `research.md` §3, não implementado — o checkout não
  tem etapas, então não havia progresso a indicar.
- **Rota `/termos` criada**: o rodapé exige o link (FR-020) e a rota não existia. A página tem a
  estrutura das políticas com o conteúdo marcado como "a definir pela loja" — redigir cláusula
  jurídica não é tarefa do agente.
- **Busca no celular**: abaixo de 900px a busca sai do cabeçalho e passa para o menu recolhido,
  onde cabe com largura confortável (T026).
- **Duas cores literais autorizadas**: o `::backdrop` do painel do carrinho (não herda variáveis
  entre motores) e o azul `#1877f2` do selo do canal Meta no painel, que é cor de marca de
  terceiro e precisa ser reconhecível ao lado do Mercado Livre.
- **Peso das fontes**: 38 blocos usavam Bodoni abaixo de 24px e passaram para a sem serifa; todo
  `font-weight: 700/800` virou 600, que é o peso mais pesado efetivamente carregado.

## Notes

- Nenhuma dependência nova em nenhuma tarefa (Princípio VII).
- O único teste novo é T021; não há regra de negócio nova além da divisão de categorias.
- Textos novos em pt-BR inline (Princípio V); serão extraídos no EDI-121.
- Não commitar: o agente apenas sugere a mensagem de commit (Princípio I).
