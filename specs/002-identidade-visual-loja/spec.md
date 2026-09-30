# Feature Specification: Identidade visual e layout da loja Dona Frida

**Feature Branch**: `edilsonaandrade/edi-116-identidade-visual-e-layout-da-loja-dona-frida`
**Created**: 2026-09-30
**Status**: Draft
**Linear**: EDI-116 (absorve o EDI-117)
**Input**: User description: "EDI-116 — Identidade visual e layout da loja Dona Frida. Paleta: #F4E8E8 rosa suave, #FFFFFF branco, #D8C6C4 nude, #B8A6A4 nude escuro, #767070 cinza. Títulos em serifa elegante, texto em sem serifa. Referência de estrutura: https://bazar-dani-vieira.myshopify.com/. Substituir os tokens do Voxelas em app/globals.css, redesenhar header transparente sobre o hero com menu de categorias, busca, conta e carrinho em drawer, sequência de seções da home, rodapé rosa com newsletter, e aplicar a nova paleta em catálogo, PDP, carrinho, checkout, conta e admin."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A loja parece a Dona Frida (Priority: P1)

Uma compradora chega a qualquer página da loja e vê uma marca de perfumaria e bijuteria:
rosa suave, nude e branco, títulos em serifa e texto em sem serifa. Nada da paleta anterior
(laranja, roxo, turquesa, amarelo) e nenhuma fonte arredondada infantil sobrou.

**Why this priority**: é a base de tudo. Sem os tokens trocados, toda tela redesenhada em
cima continuaria herdando a cor errada. Entrega valor sozinha: mesmo sem mudar um único
layout, a loja já deixa de parecer o Voxelas Duo.

**Independent Test**: abrir home, catálogo, página de produto, carrinho, checkout e painel
admin e confirmar que nenhuma cor da paleta antiga aparece e que a tipografia mudou, com o
layout ainda funcionando.

**Acceptance Scenarios**:

1. **Given** a loja aberta em qualquer página pública, **When** a compradora observa a tela,
   **Then** todas as cores vêm da paleta Dona Frida e os títulos estão em serifa.
2. **Given** um leitor de tela ou usuário de teclado, **When** navega por links e botões,
   **Then** o foco é visível com contraste suficiente sobre o fundo daquela tela.
3. **Given** um texto de corpo sobre qualquer fundo da paleta, **When** o contraste é medido,
   **Then** ele atinge no mínimo 4.5:1 (WCAG AA).

---

### User Story 2 - Home editorial que convida a navegar (Priority: P2)

A compradora entra pela home e encontra um hero de largura total com o cabeçalho transparente
sobre ele, seguido das seções montadas no painel (carrossel de destaques, banner com chamada,
carrossel com selo de promoção, banner com texto, texto de destaque, banner final) e termina
num rodapé rosa com os links da loja, redes sociais, newsletter e políticas.

**Why this priority**: é a vitrine e a primeira impressão. A montagem das seções já existe
(EDI-114/EDI-115); o que falta é o tratamento visual e o rodapé, que hoje não existe.

**Independent Test**: com banners e carrosséis cadastrados no admin, abrir a home e percorrer
do topo ao rodapé no desktop e no celular.

**Acceptance Scenarios**:

1. **Given** uma home com banner hero ativo, **When** a página carrega, **Then** o cabeçalho
   aparece transparente sobre a imagem do hero e ganha fundo sólido ao rolar a página.
2. **Given** uma home sem nenhuma seção ativa, **When** a compradora acessa `/`, **Then** ela
   continua sendo levada ao catálogo, como hoje.
3. **Given** qualquer página da loja, **When** a compradora rola até o fim, **Then** vê o
   rodapé com as colunas de navegação, redes sociais, newsletter e os links de políticas.
4. **Given** um carrossel com mais itens do que cabem na tela, **When** a compradora arrasta
   ou usa as setas, **Then** os produtos avançam sem quebrar o layout no celular.

---

### User Story 3 - Encontrar e comprar sem sair do fluxo (Priority: P3)

A compradora navega por categorias a partir do cabeçalho, busca um perfume pelo nome, e ao
adicionar ao carrinho vê um painel lateral abrir com o que já escolheu, podendo continuar
comprando ou ir ao checkout. O acesso à conta fica num menu suspenso com entrar, pedidos e
perfil.

**Why this priority**: melhora conversão e é o que mais muda a estrutura do cabeçalho, mas
depende da identidade (P1) já estar aplicada.

**Independent Test**: a partir da home, abrir o menu de categorias, buscar um produto,
adicionar ao carrinho e concluir no checkout, no desktop e no celular.

**Acceptance Scenarios**:

1. **Given** o cabeçalho em qualquer página, **When** a compradora abre o menu de categorias,
   **Then** vê as categorias com produtos publicados e, se houver mais do que cabe, um item
   "Mais" que revela as restantes.
2. **Given** o campo de busca no cabeçalho, **When** a compradora envia um termo, **Then** ela
   chega ao catálogo já filtrado por esse termo.
3. **Given** um produto na página de produto, **When** a compradora adiciona ao carrinho,
   **Then** o painel lateral do carrinho abre mostrando o item, o subtotal e os botões de
   continuar comprando e finalizar.
4. **Given** um carrinho vazio, **When** o painel lateral é aberto, **Then** ele mostra a
   mensagem de vazio com o botão "Voltar à loja" e o convite para entrar na conta.
5. **Given** a compradora com sessão aberta, **When** clica no ícone de conta, **Then** vê o
   menu com Pedidos e Perfil; sem sessão, vê Entrar e Criar conta.
6. **Given** o painel lateral aberto, **When** a compradora pressiona Esc ou clica fora,
   **Then** ele fecha e o foco volta para o botão do carrinho.

---

### User Story 4 - Painel e telas de conta na mesma identidade (Priority: P4)

A dona da loja entra no painel administrativo e nas telas de conta do cliente e encontra a
mesma paleta e tipografia da vitrine, sem telas órfãs com as cores antigas.

**Why this priority**: não afeta a compradora, mas uma tela com a paleta antiga denuncia o
redesenho pela metade. Fica por último porque é volume de ajuste, não decisão de design.

**Independent Test**: percorrer login do admin, lista de produtos, formulário de produto,
banners, pedidos, configurações, e as telas de entrar/cadastro/minha conta do cliente.

**Acceptance Scenarios**:

1. **Given** qualquer tela do painel, **When** a dona da loja a abre, **Then** as cores e
   fontes são as da Dona Frida e nenhum elemento ficou ilegível.
2. **Given** as telas de erro e a página 404, **When** exibidas, **Then** usam a nova
   identidade e mantêm o selo tipográfico da marca.

---

### Edge Cases

- **Hero ausente**: se a primeira seção da home não for um banner hero, o cabeçalho não pode
  ficar transparente sobre conteúdo claro — ele começa sólido.
- **Imagem escura ou clara demais no hero**: o texto sobre o banner precisa continuar legível
  independentemente da foto enviada pelo admin.
- **Categoria sem produto publicado**: não aparece no menu de categorias.
- **Muitas categorias**: o menu não pode crescer indefinidamente; o excedente vai para "Mais".
- **Nome de produto muito longo** no card do carrossel e no painel do carrinho: não pode
  quebrar o alinhamento da grade.
- **Painel do carrinho no celular**: precisa caber na tela e não travar a rolagem da página
  por trás.
- **Rolagem com o painel aberto**: o conteúdo por trás não rola junto.
- **Movimento reduzido**: quem ativou `prefers-reduced-motion` não recebe as animações de
  abertura do painel nem as transições dos carrosséis.
- **Sessão expirada**: o menu de conta reflete o estado real, sem mostrar "Pedidos" para quem
  já não está autenticado.

## Requirements *(mandatory)*

### Functional Requirements

#### Identidade visual

- **FR-001**: O sistema MUST expor um conjunto único de tokens de design (cor, tipografia,
  espaçamento, raio e sombra) do qual toda tela deriva sua aparência.
- **FR-002**: A paleta MUST ser rosa suave `#F4E8E8`, branco `#FFFFFF`, nude `#D8C6C4`, nude
  escuro `#B8A6A4` e cinza `#767070`, acrescida dos neutros de texto necessários para atingir
  contraste AA.
- **FR-003**: Nenhum token, componente ou folha de estilo MUST conter as cores da identidade
  anterior (laranja, roxo, turquesa, amarelo e creme do Voxelas).
- **FR-004**: Títulos MUST usar uma serifa elegante e o texto corrido MUST usar uma sem
  serifa; as fontes MUST carregar sem provocar salto de layout perceptível.
- **FR-005**: Texto e elementos interativos MUST atingir contraste mínimo de 4.5:1 sobre o
  fundo em que aparecem, e o indicador de foco MUST ser visível em todas as telas.
- **FR-006**: Nenhum componente MUST escrever cor, fonte, raio ou sombra como valor literal;
  tudo vem dos tokens.

#### Cabeçalho e navegação

- **FR-007**: O cabeçalho MUST estar presente em todas as páginas da loja, com a marca à
  esquerda e os acessos de busca, conta e carrinho à direita.
- **FR-008**: O cabeçalho MUST ser transparente sobre o banner hero da home e MUST assumir
  fundo sólido ao rolar a página ou quando não houver hero.
- **FR-009**: O cabeçalho MUST oferecer navegação pelas categorias que têm produtos
  publicados, com um item "Mais" para as que excederem o espaço disponível.
- **FR-010**: O cabeçalho MUST oferecer busca por texto que leva ao catálogo já filtrado.
- **FR-011**: O acesso à conta MUST ser um menu suspenso, com Entrar e Criar conta para quem
  não tem sessão, e Pedidos, Perfil e Sair para quem tem.
- **FR-012**: No celular, a navegação MUST continuar acessível pelo menu recolhido já
  existente, sem perder nenhum destino.
- **FR-013**: O ícone do carrinho MUST indicar a quantidade de itens.

#### Carrinho em painel lateral

- **FR-014**: Adicionar um produto ao carrinho MUST abrir um painel lateral com os itens,
  subtotal e as ações de continuar comprando e finalizar a compra.
- **FR-015**: O painel MUST poder ser fechado por Esc, clique fora e botão de fechar,
  devolvendo o foco ao controle que o abriu.
- **FR-016**: O painel vazio MUST mostrar a mensagem de carrinho sem itens, o botão de voltar
  à loja e, para quem não tem sessão, o convite para entrar.
- **FR-017**: A página de carrinho existente MUST continuar acessível e consistente com o
  painel; as duas MUST refletir o mesmo estado.

#### Home e rodapé

- **FR-018**: A home MUST renderizar as seções na ordem definida no painel administrativo,
  tratando visualmente banner hero, banner intermediário, texto de destaque e carrossel.
- **FR-019**: Os cards de produto dos carrosséis e do catálogo MUST mostrar imagem, nome,
  preço e, quando houver, o selo de promoção com o preço cheio riscado.
- **FR-020**: O rodapé MUST estar presente em todas as páginas da loja, com fundo rosa e as
  áreas: navegação da loja, redes sociais, inscrição em novidades, aviso de direitos autorais
  e link para termos e políticas.
- **FR-021**: O rodapé MUST omitir automaticamente os canais de contato e redes que não
  estiverem configurados, sem deixar espaço vazio.

#### Páginas internas

- **FR-022**: Catálogo, página de produto, carrinho, checkout, pedido, encomendas e telas de
  conta do cliente MUST adotar a nova identidade sem perder nenhuma funcionalidade atual
  (filtros, avaliações, ficha técnica, estoque, link de encomenda, pagamento).
- **FR-023**: A página de produto MUST manter a galeria, a ficha técnica, as avaliações e o
  aviso de estoque, com o botão de compra sempre alcançável no celular.
- **FR-024**: O painel administrativo, as telas de erro e a página 404 MUST adotar a nova
  identidade.

#### Responsividade e movimento

- **FR-025**: Todas as telas MUST funcionar a partir de 360px de largura, sem rolagem
  horizontal.
- **FR-026**: Animações e transições MUST ser suprimidas para quem ativou preferência por
  movimento reduzido.

#### Escopo decidido

- **FR-027**: A inscrição em novidades do rodapé MUST ser apresentada como bloco visual, sem
  guardar endereço nesta entrega. O campo MUST deixar claro que ainda não está ativo, em vez
  de aceitar um e-mail e descartá-lo em silêncio.
- **FR-028**: A loja MUST ter um único tema, o claro. O alternador de tema, a preferência
  guardada no navegador e os estilos do tema escuro MUST ser removidos, junto com o código que
  se tornou morto.
- **FR-029**: O selo de promoção e o preço cheio riscado MUST existir como tratamento visual
  que só aparece quando o produto tiver preço promocional. Enquanto esse dado não existir
  (EDI-122), nenhum produto MUST exibir o selo.

### Key Entities

- **Token de design**: nome semântico (fundo, superfície, texto, texto suave, contorno, ação,
  ação sobre, destaque) e o valor correspondente na paleta. Tema único: claro.
- **Seção da home**: já existente — tipo (banner hero, banner intermediário, texto de
  destaque, carrossel), ordem, conteúdo e produtos associados.
- **Categoria**: já existente — nome e caminho usados na navegação do cabeçalho.
- **Item do carrinho**: já existente — produto, quantidade, preço; é o que o painel lateral
  apresenta.
- **Configuração de contato e redes**: já existente — e-mail, WhatsApp e redes sociais que
  alimentam o rodapé.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nenhuma cor da identidade anterior aparece em qualquer das 26 páginas da
  aplicação.
- **SC-002**: 100% das combinações de texto e fundo usadas na loja atingem contraste mínimo
  de 4.5:1, e nenhum elemento interativo fica sem indicador de foco visível.
- **SC-003**: A compradora chega de qualquer página a uma categoria, à busca, ao carrinho e à
  sua conta em no máximo 2 cliques.
- **SC-004**: Adicionar um produto ao carrinho e chegar ao checkout leva no máximo 3
  interações, sem sair da página em que a compradora estava.
- **SC-005**: Todas as telas são utilizáveis a partir de 360px de largura, sem rolagem
  horizontal em nenhuma delas.
- **SC-006**: Nenhuma funcionalidade existente deixa de funcionar: a suíte de testes segue
  verde e a verificação de tipos segue limpa.
- **SC-008**: Nenhum vestígio do tema escuro permanece — nem alternador, nem estilos, nem
  preferência guardada no navegador.
- **SC-007**: A compradora identifica a loja como de perfumes e bijuterias pela primeira tela,
  sem depender do texto do banner.

## Assumptions

- A **sequência de seções da home** descrita no EDI-116 (hero → carrossel → banner → carrossel
  → banner → carrossel → texto → banner) é **conteúdo cadastrado no painel**, não código. Esta
  entrega trata a aparência de cada tipo de seção; montar a sequência é tarefa da dona da loja.
- A referência https://bazar-dani-vieira.myshopify.com/ define **estrutura e sensação**, não é
  para ser copiada: textos, imagens e identidade são da Dona Frida.
- **Textos continuam em pt-BR escritos direto nas telas**, conforme o padrão vigente. A
  estrutura de i18n é o EDI-121 e está fora desta entrega. Os textos novos criados aqui serão
  extraídos naquele ticket.
- O **preço promocional real é o EDI-122**. Aqui nasce apenas o tratamento visual do selo e do
  preço riscado, que fica oculto até aquele dado existir.
- O **tema escuro é removido** (decisão de 2026-09-30): a paleta da marca é clara e a
  referência também. Isso elimina o alternador, a chave `donafrida-theme` no navegador e
  metade do trabalho de validação de contraste.
- A **newsletter é só o bloco visual** nesta entrega. Guardar endereços é funcionalidade nova
  e ganha ticket próprio quando a dona da loja quiser usá-la.
- A **funcionalidade de banners e destaques do painel já existe** (EDI-114 replicado no
  EDI-115) e não será reescrita — o EDI-117 foi absorvido por este ticket justamente por isso.
- A busca já existe no catálogo por termo; o cabeçalho passa a ser um novo caminho para ela,
  sem mudar como ela funciona.
- As **imagens de banner são enviadas pela dona da loja**. Esta entrega não produz fotografia
  de produto nem arte de banner; onde faltar imagem, a tela precisa se comportar bem mesmo
  assim.
- O **logotipo continua provisório em texto**. Um logotipo desenhado, se houver, entra depois
  sem exigir mudança de layout.
- Nenhuma dependência nova é assumida: fontes e ícones vêm do que o projeto já usa ou de
  fontes web carregadas como hoje.
