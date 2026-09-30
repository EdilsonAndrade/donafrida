# Phase 1 — Tokens e mapa de migração

**Feature**: Identidade visual e layout da loja Dona Frida (EDI-116)
**Data**: 2026-09-30

Esta entrega não cria nem altera nenhuma coleção, campo ou contrato de API. O "modelo de
dados" dela é o sistema de tokens e o mapa de arquivos que o consomem.

---

## 1. Tokens

Todos vivem em `:root`, em `app/globals.css`. Tema único: claro.

### Cor

| Token | Valor | Papel | Proibições |
|---|---|---|---|
| `--fundo` | `#FFFFFF` | fundo da página | — |
| `--fundo-rosa` | `#F4E8E8` | seção alternada da home, rodapé, estados sutis | — |
| `--superficie` | `#FFFFFF` | card, painel, campo de formulário | sobre `--fundo`, exige `--contorno` |
| `--contorno` | `#D8C6C4` | contorno de card, divisor, borda de campo | **nunca como cor de texto** |
| `--contorno-forte` | `#B8A6A4` | contorno em destaque, ação secundária, fio de contas | **nunca como cor de texto** |
| `--tinta` | `#2B2626` | texto de leitura, ação primária | — |
| `--tinta-suave` | `#767070` | texto secundário, rótulo, ícone | só sobre `--fundo` ou `--superficie` |
| `--acao` | `#2B2626` | botão primário, link, anel de foco | — |
| `--acao-texto` | `#FFFFFF` | texto sobre `--acao` | — |
| `--destaque` | `#B8A6A4` | selo, badge, marcação de promoção | texto só em `--tinta` |
| `--sucesso` | `#4F6B4F` | confirmação, em estoque, pagamento aprovado | — |
| `--aviso` | `#8A6D3B` | atenção, estoque baixo, pendência | — |
| `--erro` | `#A8443C` | falha, validação, mensagem de erro | — |

**Regra dura**: `--contorno` e `--contorno-forte` são cores de linha e de fundo, nunca de
texto. Contraste de 2.3:1 sobre branco — reprova em qualquer tamanho.

### Tipografia

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | `"Bodoni Moda", Georgia, serif` | **só acima de 24px** |
| `--font-body` | `"Jost", -apple-system, "Segoe UI", sans-serif` | todo o resto |

`--font-hand` deixa de existir; seus 27 usos passam a `--font-display`.

### Espaço, raio e sombra

| Token | Valor | Uso |
|---|---|---|
| `--raio` | `2px` | campo, botão, card — quase reto, ar de etiqueta impressa |
| `--raio-redondo` | `999px` | conta do fio, contador do carrinho, selo |
| `--sombra` | `0 1px 2px rgb(43 38 38 / 0.06)` | usada com parcimônia; a separação padrão é o contorno |
| `--container` | `1180px` | largura do conteúdo, como hoje |

---

## 2. Mapa de migração dos tokens antigos

Substituição mecânica, aplicável a todos os arquivos de estilo:

| De | Para | Ocorrências | Revisão manual? |
|---|---|---|---|
| `--creme` | `--fundo` | 15 | Sim — onde era fundo de seção, vira `--fundo-rosa` |
| `--surface` | `--superficie` | 55 | Não |
| `--surface-line` | `--contorno` | 85 | Não |
| `--preto` | `--tinta` | 40 | Não |
| `--texto-soft` | `--tinta-suave` | 62 | Não |
| `--roxo` | `--acao` | 84 | **Sim** — era ação, foco e link ao mesmo tempo |
| `--rosa` | `--destaque` | 28 | **Sim** — em gradiente, o gradiente sai inteiro |
| `--laranja` | `--destaque` | 8 | **Sim** — conferir se o papel não era de aviso |
| `--turquesa` | `--sucesso` | 10 | Sim — conferir se não era decorativo |
| `--amarelo` | `--aviso` | 7 | Sim |
| `--font-hand` | `--font-display` | 27 | **Sim** — conferir tamanho; abaixo de 24px vira `--font-body` |
| `--font-display` | `--font-display` | 31 | **Sim** — mesma regra dos 24px |
| `--font-body` | `--font-body` | 70 | Não |

---

## 3. Arquivos e volume

| Arquivo | Tokens antigos | Arco-íris | Natureza do trabalho |
|---|---|---|---|
| `app/globals.css` | 3 | 0 | **Reescrito**: tokens novos, tema único, base tipográfica |
| `components/admin/admin.module.css` | 89 | 0 | Migração |
| `components/produtos/produtos.module.css` | 62 | 6 | Migração + card redesenhado + limpeza |
| `components/carrinho/carrinho.module.css` | 42 | 0 | Migração + estilo do painel lateral |
| `components/cliente/cliente.module.css` | 41 | 0 | Migração |
| `components/SiteHeader.module.css` | 34 | 6 | **Reescrito** com o cabeçalho novo |
| `components/checkout/checkout.module.css` | 32 | 0 | Migração + passo em fio de contas |
| `components/home/home.module.css` | 30 | 5 | Migração + tratamento das seções + limpeza |
| `components/admin/secoesHome.module.css` | 26 | 0 | Migração |
| `components/encomendas/encomendas.module.css` | 21 | 2 | Migração + limpeza |
| `components/erro/PaginaErro.module.css` | 14 | 0 | Migração |
| `components/pagamento/pagamento.module.css` | 11 | 0 | Migração |
| `components/admin/ConfirmModal.module.css` | 7 | 0 | Migração |
| `components/admin/Toast.module.css` | 3 | 0 | Migração — conferir erro/sucesso/aviso |
| `components/AvisoSpam.module.css` | 0 | 0 | Conferir |

**19 ocorrências de arco-íris** (gradientes multicoloridos e `nth-child` que pinta cada letra
de uma cor) concentradas em `produtos`, `SiteHeader`, `home` e `encomendas`. Não são resolvidas
por troca de token: o efeito inteiro sai e o título vira tipografia limpa.

---

## 4. Estado e comportamento novos

Nenhum dado persistido. O que existe é estado de interface:

| Sinal | Onde vive | Quem escreve | Quem lê |
|---|---|---|---|
| `data-hero-topo` | elemento da primeira seção da home | `app/page.tsx`, quando a 1ª seção é banner hero | CSS do cabeçalho, via `body:has(...)` |
| `data-rolado` | `<html>` | `HeaderScroll` (cliente), ao sair do topo | CSS do cabeçalho |
| painel do carrinho aberto | `<dialog>` | `CarrinhoDrawer`, ao adicionar item | o próprio navegador |
| menu de conta aberto | estado local do `MenuConta` | clique e teclado | o próprio componente |

**Chave removida do navegador**: `donafrida-theme`.

---

## 5. Única função pura nova

`lib/site/navegacao.ts`

```
dividirCategorias(categorias: string[], limite = 5)
  → { naBarra: string[]; noMais: string[] }
```

Regra: até `limite` categorias vão para a barra; havendo mais que `limite`, a barra recebe
`limite` e o restante vai para "Mais". Com `limite` ou menos, "Mais" fica vazio e o botão não é
renderizado.

Casos de teste: lista vazia; menos que o limite; exatamente o limite; acima do limite; limite
igual a zero.
