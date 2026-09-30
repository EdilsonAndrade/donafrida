# Phase 0 — Pesquisa e direção de design

**Feature**: Identidade visual e layout da loja Dona Frida (EDI-116)
**Data**: 2026-09-30

---

## 1. Direção visual

**Decisão**: *Vitrine de perfumaria* — fundo branco, seções em rosa poeira, cartões com
contorno nude fino, títulos em didone e corpo em geométrica. A página se comporta como a
prateleira de uma loja de essências: muito ar, pouca cor, o produto é a única coisa saturada
na tela.

**Racional**: a compradora chega por celular, vinda do Instagram ou do WhatsApp, e decide em
segundos se aquilo parece uma loja de verdade. Foto de perfume e bijuteria é brilhante e
colorida; um fundo quieto faz o produto brilhar. A paleta dada é inteira de baixa saturação —
brigar com ela colocando cor nos controles destruiria o efeito.

**Alternativas descartadas**:
- *Rosa como fundo de página inteira*: satura a tela e derruba o contraste dos cards brancos.
  O rosa rende muito mais como seção alternada e rodapé.
- *Fundo creme (#F4F1EA) com serifa de alto contraste e acento terracota*: é exatamente o
  visual padrão que sai de qualquer gerador. Não é da Dona Frida, é de ninguém.
- *Cartões com sombra*: sombra sobre rosa poeira suja a cor. Contorno de 1px em nude separa
  melhor e é mais próximo de embalagem impressa.

---

## 2. Tipografia

**Decisão**: **Bodoni Moda** (display) + **Jost** (corpo e interface).

| Papel | Fonte | Uso |
|---|---|---|
| Display | Bodoni Moda (400/500, itálico em citações) | Título do hero, nome das seções, nome do produto na página de produto, selo da marca |
| Corpo | Jost (400/500/600) | Todo o resto: parágrafos, rótulos, botões, formulários, painel, nome do produto no card |

**Racional**: Bodoni é a letra do rótulo de frasco de perfume e da etiqueta de joalheria —
serifas em fio, contraste extremo, ar de vitrine. Jost é uma geométrica de esqueleto Futura,
que era a companheira histórica da didone em revista de moda; ela é neutra sem ser corporativa
e tem números bem desenhados, o que importa numa loja cheia de preço. As duas existem no
Google Fonts em versão variável, então a troca não acrescenta dependência nem peso relevante.

**Regra de uso (importa mais que a escolha)**: Bodoni só acima de 24px. As serifas em fio
somem em tamanho pequeno e viram borrão no celular. Nome de produto no card é Jost 500, não
Bodoni. Essa regra evita o erro clássico de aplicar a display em tudo e perder legibilidade.

**Alternativas descartadas**:
- *Playfair Display + Inter*: o par padrão de qualquer página gerada hoje. Correto e
  esquecível.
- *Cormorant Garamond*: bonita, mas fina demais para preço e botão; exigiria uma terceira
  fonte para a interface.
- *Fraunces + Karla*: mais quente e artesanal, boa para cosmético natural; erra o alvo de
  perfumaria importada e bijuteria folheada, que é o catálogo real da loja.
- *Manter Baloo 2 / Nunito / Caveat*: são do Voxelas, arredondadas e infantis. Saem inteiras.

---

## 3. Elemento de assinatura: o fio de contas

**Decisão**: uma fileira de pequenos círculos nude — o **fio de contas** — é o único ornamento
do site, e ele sempre carrega informação:

- **separa as seções da home**, no lugar de uma linha reta;
- **é o indicador de posição dos carrosséis** (cada conta é uma página do trilho; a conta atual
  é cheia, as outras são vazadas).

O terceiro uso previsto — progresso do checkout — **não foi implementado**: o checkout da loja é
um formulário de página única, sem etapas, então não havia progresso a indicar. Forçar o
elemento ali seria decoração, exatamente o que a decisão evita.

**Racional**: é literalmente o produto da loja — um colar visto de perto — e, por ser um
indicador de posição, ele não é decoração: some quando não há nada a indicar. O brief pedia um
risco estético justificável; este é ele, e o custo de errar é baixo porque o elemento é pequeno
e repetível.

**Alternativas descartadas**:
- *Numeração 01 / 02 / 03 nas seções*: as seções da home são montadas pela dona da loja em
  qualquer ordem e quantidade. Numerar sugeriria uma sequência que não existe.
- *Divisor com filete duplo*: elegante e completamente genérico.

---

## 4. Tokens: renomear em vez de só trocar valor

**Decisão**: trocar os nomes de cor por nomes semânticos e migrar todos os arquivos de estilo
de uma vez, por substituição mecânica, com revisão manual só nos pontos onde o nome antigo
escondia dois papéis diferentes.

| Token antigo | Papel real que exercia | Token novo | Valor |
|---|---|---|---|
| `--creme` | fundo da página | `--fundo` | `#FFFFFF` |
| `--surface` | superfície de card | `--superficie` | `#FFFFFF` |
| — | fundo de seção alternada e rodapé | `--fundo-rosa` | `#F4E8E8` |
| `--surface-line` | contorno, divisor | `--contorno` | `#D8C6C4` |
| — | contorno em destaque, ação secundária | `--contorno-forte` | `#B8A6A4` |
| `--preto` | texto principal | `--tinta` | `#2B2626` |
| `--texto-soft` | texto secundário | `--tinta-suave` | `#767070` |
| `--roxo` | ação primária, foco, link | `--acao` | `#2B2626` |
| `--rosa` | destaque, badge | `--destaque` | `#B8A6A4` |
| `--laranja` | destaque quente | `--destaque` | `#B8A6A4` |
| `--turquesa` | confirmação, sucesso | `--sucesso` | `#4F6B4F` |
| `--amarelo` | atenção | `--aviso` | `#8A6D3B` |
| — | erro | `--erro` | `#A8443C` |
| `--font-hand` | manuscrita decorativa | `--font-display` | Bodoni Moda |

**Racional**: `--roxo: #2B2626` seria uma mentira permanente, que o próximo a mexer no arquivo
pagaria. O custo de renomear é uma passada de `sed` por 15 arquivos; o custo de não renomear é
para sempre. Além disso o Princípio VI exige que todo componente derive dos tokens — nomes
semânticos são o que torna essa regra verificável.

**Sobre as cores fora da paleta de cinco**: `--tinta` `#2B2626`, `--erro`, `--sucesso` e
`--aviso` não estão na paleta fornecida, e são obrigatórios:

- `#767070` sobre branco dá **4.86:1**. Passa AA para texto normal, mas por margem estreita, e
  falha para texto sobre o rosa `#F4E8E8`. Texto de leitura precisa de um grafite. `#2B2626`
  sobre branco dá **14.9:1** e sobre o rosa **13.4:1**.
- Erro, sucesso e aviso são exigência do **Princípio II**: uma falha precisa ser reconhecível
  como falha. Em tons dessaturados, para não romper a paleta.

Todas quatro são neutros escuros ou dessaturados — o brief pede "detalhes neutros", então elas
estendem a paleta em vez de contrariá-la.

---

## 5. Contraste verificado

| Frente | Fundo | Razão | Uso |
|---|---|---|---|
| `#2B2626` | `#FFFFFF` | 14.9:1 | texto de leitura |
| `#2B2626` | `#F4E8E8` | 13.4:1 | texto sobre seção rosa |
| `#767070` | `#FFFFFF` | 4.86:1 | texto secundário (AA) |
| `#FFFFFF` | `#2B2626` | 14.9:1 | botão primário |
| `#2B2626` | `#B8A6A4` | 6.4:1 | botão secundário |
| `#B8A6A4` | `#FFFFFF` | 2.3:1 | **só contorno e ícone decorativo, nunca texto** |

**Regra derivada**: `--contorno-forte` e `--contorno` são proibidos como cor de texto. Fica
registrado porque é o erro fácil de cometer com esta paleta.

---

## 6. Cabeçalho transparente sobre o hero

**Decisão**: CSS `body:has([data-hero-topo])` decide a transparência; um componente cliente
mínimo marca `data-rolado` no `<html>` quando a página sai do topo.

**Racional**: o cabeçalho vive no layout raiz e o hero vive na home — são ramos diferentes da
árvore. `:has()` resolve a relação sem levantar estado, sem contexto novo e sem prop drilling.
A degradação é segura: um navegador sem `:has()` mostra o cabeçalho sólido, que é o
comportamento correto em toda página que não é a home.

**Alternativas descartadas**:
- *Ler o pathname no `proxy.ts` e repassar por header*: acopla a camada de rede a uma decisão
  de estilo.
- *Context React com provider no layout*: obriga o cabeçalho a virar componente cliente
  inteiro, perdendo a leitura de sessão no servidor que ele faz hoje.
- *`animation-timeline: scroll()`*: suporte irregular no Safari, e o efeito é binário — não
  compensa.

---

## 7. Painel lateral do carrinho

**Decisão**: `<dialog>` nativo com `showModal()`, posicionado à direita.

**Racional**: entrega de graça, pelo navegador, o que custaria bastante código: prisão de foco,
fechamento com Esc, `aria-modal`, inertização do resto da página e o `::backdrop`. Resolve
sozinho os critérios FR-015 e a borda "rolagem com o painel aberto". Menos código que um
`aside` feito à mão, e mais acessível.

**Cuidados**: `::backdrop` não herda variáveis CSS do `:root` em todos os motores — a cor do
fundo escurecido vai literal no seletor `::backdrop`. Essa é uma das **duas exceções
autorizadas** à regra de não escrever cor literal; a outra é o azul `#1877f2` do selo do canal
Meta no painel, cor de marca de terceiro que precisa ser reconhecível ao lado do Mercado Livre.
Ficam anotadas aqui para não parecerem descuido na revisão.

**Alternativas descartadas**:
- *`aside` + `role="dialog"` com prisão de foco manual*: mais código, mais chance de erro de
  acessibilidade, nenhum ganho.
- *Substituir a página `/carrinho` pelo painel*: a página é o destino de link direto e
  sobrevive a recarregamento. FR-017 manda as duas coexistirem lendo o mesmo estado.

---

## 8. Menu de categorias com "Mais"

**Decisão**: `listarCategorias()` (já existe em `lib/produtos/repository.ts:52`) alimenta o
cabeçalho no servidor; as **cinco primeiras** aparecem em linha e o restante vai para um menu
"Mais". No celular tudo cai no menu recolhido já existente.

**Racional**: a função já traz só categorias com produto publicado, então FR-009 sai sem
consulta nova. Cinco é o que cabe em 1180px ao lado da marca, da busca e dos ícones, com a
regra de 4–7 itens de navegação primária.

**Alternativa descartada**: mega menu com subcategorias. O catálogo hoje tem uma profundidade
de categoria só; um mega menu ficaria vazio.

---

## 9. Bloco de novidades do rodapé

**Decisão**: quando `NEXT_PUBLIC_LOJA_WHATSAPP` estiver configurado, o bloco convida a receber
as novidades pelo WhatsApp, com link real. Sem ele, o bloco mostra o campo de e-mail
desabilitado com a nota de que a inscrição ainda não está aberta.

**Racional**: FR-027 decidiu não guardar endereço agora, mas um campo que aceita e-mail e o
joga fora é pior que não ter campo. O WhatsApp já é o canal real da loja e o helper
`lib/site/contato.ts` já sabe quando ele existe — o bloco vira útil em vez de decorativo, sem
funcionalidade nova. FR-021 (omitir o que não está configurado) sai pelo mesmo caminho.

---

## 10. Selo de promoção

**Decisão**: um componente de preço único, usado no card, no carrossel e na página de produto,
que recebe preço e preço promocional opcional. Com o promocional ausente — que é o caso de todo
produto hoje — ele mostra só o preço, sem selo.

**Racional**: FR-029. Quando o EDI-122 acrescentar o campo, acende sozinho em todos os lugares
de uma vez, sem caçar marcação repetida.

---

## 11. Tema escuro: remoção

**Decisão**: remover o bloco `:root[data-theme="dark"]`, o componente `ThemeToggle`, o script
de pré-hidratação em `app/layout.tsx` e a chave `donafrida-theme` do navegador.

**Racional**: FR-028/SC-008. A paleta da marca é clara e a referência é clara. Manter o tema
escuro custaria uma segunda paleta inteira e dobraria a verificação de contraste, para um modo
que a loja nunca teve conteúdo para justificar. O Princípio VII manda remover o código que a
decisão tornou morto, na mesma entrega.

**Efeito colateral a tratar**: o `<html>` perde o atributo vindo do script e fica
`data-theme="light"` fixo — ou perde o atributo de vez. Vale conferir se algum estilo usa o
seletor antes de apagar.

---

## 12. Riscos

| Risco | Tratamento |
|---|---|
| A substituição mecânica de tokens acerta o nome mas erra o papel (um `--roxo` que era fundo de badge vira texto grafite ilegível) | Após o `sed`, revisar visualmente cada um dos 15 arquivos; os pontos suspeitos estão listados no `data-model.md` |
| Restos do visual infantil (gradientes arco-íris, `nth-child` colorido — 19 ocorrências) não são resolvidos por troca de token | Tarefa própria de remoção, por arquivo |
| Bodoni ilegível em tamanho pequeno | Regra "só acima de 24px", verificada na revisão de cada tela |
| `<dialog>` com animação de entrada precisa de `@starting-style` para animar a abertura | Animação simples de deslize; sem ela, o painel apenas aparece — aceitável |
| O cabeçalho fixo cobre conteúdo ao ancorar | `scroll-padding-top` no `html` |
