# Implementation Plan: Identidade visual e layout da loja Dona Frida

**Branch**: `edilsonaandrade/edi-116-identidade-visual-e-layout-da-loja-dona-frida` (a criar
pelo usuário após o commit do EDI-115) | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)
**Linear**: EDI-116 (absorve o EDI-117)

## Summary

Trocar a identidade herdada do Voxelas Duo pela da Dona Frida e completar a vitrine com as
peças que o projeto nunca teve: rodapé, painel lateral do carrinho e navegação por categorias
no cabeçalho.

O trabalho tem duas naturezas bem diferentes, e o plano as separa:

1. **Migração mecânica** — renomear os tokens de cor para nomes semânticos e passar essa
   renomeação por 15 arquivos de estilo de uma vez. Resolve sozinha a maior parte de FR-001 a
   FR-006 e das telas internas (FR-022, FR-024).
2. **Construção nova** — rodapé, painel lateral do carrinho, menu de categorias, busca no
   cabeçalho, menu de conta, componente de preço com selo e o fio de contas.

A direção visual, o par tipográfico e o contraste verificado estão em
[research.md](./research.md). Os tokens e o mapa arquivo a arquivo estão em
[data-model.md](./data-model.md).

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16.3 (App Router)
**Primary Dependencies**: nenhuma nova. CSS Modules e `next/font` ou `<link>` para as fontes,
como já é feito hoje
**Storage**: nenhuma mudança. Nenhuma coleção nova, nenhum campo novo
**Testing**: Vitest (suíte herdada, 603 testes) + `tsc --noEmit`
**Target Platform**: navegadores modernos; layout a partir de 360px
**Project Type**: aplicação web (App Router, Server Components com ilhas cliente)
**Performance Goals**: não regredir o carregamento da home; duas famílias de fonte variável no
lugar das três atuais
**Constraints**: sem dependência nova (Princípio VII); contraste AA em toda combinação
(FR-005); movimento reduzido respeitado (FR-026)
**Scale/Scope**: 26 rotas, 15 arquivos de estilo, ~6 componentes novos

## Constitution Check

- [x] **I. Fluxo Spec-Driven** — EDI-116 no Linear; a branch usará o `gitBranchName` da issue;
      nenhum commit será feito pelo agente.
- [x] **II. Erros Visíveis** — entrega sem rota nova. Os tokens `--erro`, `--sucesso` e
      `--aviso` existem justamente para que uma falha continue reconhecível como falha depois
      da troca de paleta.
- [x] **III. Tipos e Testes** — `tsc --noEmit` e `vitest run` ao fim. Sem regra de negócio
      nova: a única lógica acrescentada é a escolha de quais categorias vão para o menu "Mais",
      que é função pura e ganha teste unitário.
- [x] **IV. Segredos Fora do Código** — nenhuma variável nova. O rodapé consome
      `NEXT_PUBLIC_LOJA_WHATSAPP` e `LOJA_EMAIL_CONTATO`, que já existem e já estão no
      `.env.example`.
- [x] **V. Textos e i18n** — textos novos em pt-BR inline, como manda o padrão vigente. Ficam
      concentrados nos componentes novos, o que facilita a extração no EDI-121.
- [⚠] **VI. Design Deliberado** — skills `frontend-design`, `product-page-design` e
      `site-architecture` invocadas antes de qualquer código. Tokens centralizados, largura de
      celular e foco visível cobertos. **O item "tema claro e escuro" não se aplica**: esta
      entrega remove o tema escuro por decisão do usuário. Ver Complexity Tracking.
- [x] **VII. Simplicidade** — nenhuma dependência nova. O `<dialog>` nativo substitui o que
      seria um painel feito à mão. Código morto removido na mesma entrega: `ThemeToggle`,
      estilos do tema escuro, script de tema, `--font-hand` e os estilos arco-íris.

## Project Structure

### Documentation (this feature)

```text
specs/002-identidade-visual-loja/
├── spec.md
├── plan.md              # este arquivo
├── research.md          # direção visual, tipografia, contraste, decisões técnicas
├── data-model.md        # tokens e mapa de migração arquivo a arquivo
├── quickstart.md        # Test Guide
├── checklists/
│   └── requirements.md
└── tasks.md             # gerado pelo /speckit-tasks
```

Não há diretório `contracts/`: a entrega não cria nem altera nenhuma rota de API, contrato de
dados ou interface consumida por terceiros. O "contrato" desta feature são os tokens, e eles
estão no `data-model.md`.

### Source Code (repository root)

```text
app/
├── globals.css                      # REESCRITO — tokens semânticos, tema único, fio de contas
├── layout.tsx                       # remove script de tema; adiciona SiteFooter e fontes novas
├── page.tsx                         # marca data-hero-topo quando a 1ª seção é banner hero
├── icon.svg                         # revisto para a nova paleta
├── global-error.tsx, not-found.tsx  # revisão de estilo

components/
├── SiteHeader.tsx / .module.css     # REESCRITO — categorias, "Mais", busca, conta, carrinho
├── MenuMobile.tsx                   # navegação recolhida com as categorias
├── ThemeToggle.tsx                  # REMOVIDO
├── site/
│   ├── SiteFooter.tsx / .module.css # NOVO — rodapé rosa, redes, novidades, políticas
│   ├── MenuCategorias.tsx           # NOVO — categorias em linha + "Mais"
│   ├── MenuConta.tsx                # NOVO — menu suspenso da conta
│   ├── BuscaHeader.tsx              # NOVO — campo de busca que leva ao catálogo
│   ├── HeaderScroll.tsx             # NOVO — marca data-rolado no <html>
│   └── FioDeContas.tsx / .module.css# NOVO — divisor, paginação de carrossel, passo do checkout
├── carrinho/
│   ├── CarrinhoDrawer.tsx           # NOVO — <dialog> lateral
│   └── carrinho.module.css          # estilo do painel + migração de tokens
├── produtos/
│   ├── Preco.tsx                    # NOVO — preço com selo de promoção opcional (oculto hoje)
│   └── produtos.module.css          # migração + card redesenhado
├── home/home.module.css             # migração + tratamento de banner, carrossel e texto
├── checkout/, cliente/, encomendas/, pagamento/, erro/, admin/  # migração de tokens
└── AvisoSpam.module.css             # migração de tokens

lib/
├── site/navegacao.ts                # NOVO — divide categorias entre a barra e o menu "Mais"
└── site/navegacao.test.ts           # NOVO — teste da divisão
```

**Structure Decision**: mantém a organização atual do projeto — componentes por domínio em
`components/<área>/` com um CSS Module por área, e helpers puros em `lib/`. Os componentes
novos de casca do site ganham a pasta `components/site/`, que hoje não existe e evita inchar a
raiz de `components/`, onde já convivem `SiteHeader`, `MenuMobile` e `AvisoSpam`.

## Phases

- **Phase 0**: [research.md](./research.md) — direção visual, tipografia, contraste, `:has()`,
  `<dialog>`, menu de categorias, novidades, selo, remoção do tema escuro, riscos.
- **Phase 1**: [data-model.md](./data-model.md) — tokens semânticos, mapa de migração dos 15
  arquivos, pontos de revisão manual · [quickstart.md](./quickstart.md) — Test Guide.

## Ordem de execução sugerida

A ordem segue as prioridades da spec, e cada etapa deixa a loja em estado utilizável:

1. **P1 — fundação** (US1): tokens novos em `globals.css`, fontes trocadas, remoção do tema
   escuro, migração mecânica dos 15 arquivos, limpeza dos estilos arco-íris.
2. **P2 — vitrine** (US2): rodapé, tratamento visual das seções da home, cabeçalho transparente
   sobre o hero, fio de contas, componente de preço.
3. **P3 — navegação e compra** (US3): menu de categorias com "Mais", busca no cabeçalho, menu
   de conta, painel lateral do carrinho.
4. **P4 — acabamento** (US4): painel administrativo, telas de conta, erro e 404.

## Complexity Tracking

| Violação | Por que é necessária | Alternativa mais simples rejeitada porque |
|---|---|---|
| Princípio VI pede verificar "tema claro e escuro"; esta entrega **remove** o tema escuro | Decisão do usuário em 2026-09-30 (FR-028, SC-008): a paleta da marca e a referência visual são claras. Manter o tema escuro exigiria inventar uma segunda paleta que ninguém pediu e dobrar a verificação de contraste | Manter o tema escuro foi rejeitado por custo sem demanda: a loja nunca teve conteúdo que o justificasse, e a paleta fornecida não tem tons escuros para derivá-lo com honestidade. A redação do princípio será emendada para "todos os temas suportados" |
| Cor literal em `::backdrop` | `::backdrop` não herda variáveis do `:root` de forma confiável entre motores | Declarar a variável também em `::backdrop` não funciona em todos os navegadores; está registrada no research.md §7 |
| Azul `#1877f2` literal no selo do canal Meta (`admin.module.css`) | É cor de marca de terceiro: o selo precisa ser reconhecível de relance ao lado do Mercado Livre | Usar `--acao` apagaria a distinção entre os canais na lista de produtos, que é justamente o que o selo existe para dar |
| `listarCategorias()` passa a rodar no cabeçalho, em toda página | FR-009 exige as categorias no cabeçalho, e o cabeçalho vive no layout raiz | Uma rota ou cache dedicado seria estrutura nova para uma consulta `distinct` barata; se pesar, vira otimização própria com medida na mão |

## Post-design Constitution Check

✅ Mantido, com a divergência do Princípio VI registrada acima e a emenda da constituição
proposta na mesma entrega.
