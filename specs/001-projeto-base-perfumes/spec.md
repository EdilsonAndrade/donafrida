# Feature Specification: Projeto base Dona Frida (perfumes e bijuterias)

**Feature Branch**: `edilsonaandrade/edi-115-criar-projeto-dona-frida-a-partir-do-voxelas-duo`
**Linear**: EDI-115
**Created**: 2026-09-29
**Status**: Draft
**Input**: "Dona Frida: loja de perfumes e bijuterias criada a partir do código do Voxelas Duo, sem nada de impressão 3D. Calculadora de custo = custo do produto (compra) + embalagem + lista de itens adicionais; precificação por canal mantida; remover 'preço de escala'. Estoque mantido. Encomendas viram pedidos em quantidade dos produtos da loja. Ficha técnica de perfume e bijuteria. Remover widget de chat. Trocar marca, textos e e-mails para Dona Frida. .env.example com as chaves da nova empresa. Deploy em novo projeto Vercel."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin calcula o custo e o preço de um perfume revendido (Priority: P1)

A dona da loja cadastra um perfume informando quanto pagou por ele, o custo da embalagem e os itens adicionais que acompanham a venda (ex.: "Sacola de presente R$ 2,50", "Amostra brinde R$ 1,00"). O painel mostra o custo total e sugere o preço de venda em cada canal (site, Mercado Livre, Shopee), considerando as taxas e a margem desejada.

**Why this priority**: é o coração da operação de revenda. Sem custo correto, não há preço nem margem confiáveis. A calculadora atual pede dados de impressão 3D, que não existem neste negócio.

**Independent Test**: cadastrar um produto com custo de compra R$ 32,00, embalagem R$ 3,50 e dois itens adicionais (R$ 2,50 e R$ 1,00). O custo total deve ser R$ 39,00, e o simulador de preço deve partir desse valor.

**Acceptance Scenarios**:

1. **Given** o formulário de produto, **When** a admin informa compra R$ 32,00, embalagem R$ 3,50 e itens "Sacola" R$ 2,50 e "Amostra" R$ 1,00, **Then** o painel mostra o detalhamento e o custo total de R$ 39,00.
2. **Given** um produto sem itens adicionais, **When** a admin informa só compra e embalagem, **Then** o custo total é a soma dos dois.
3. **Given** o custo total calculado, **When** a admin abre o simulador de preço, **Then** ele mostra o preço sugerido e o lucro por canal a partir do custo total, sem nenhuma opção de "preço de escala".
4. **Given** um item adicional com nome vazio ou valor negativo, **When** a admin salva, **Then** o sistema aponta o erro no item e não salva.
5. **Given** o formulário de produto, **When** a admin procura qualquer campo de impressão 3D (filamento, impressora, energia, horas de impressão, taxa de falha), **Then** nenhum deles existe.

---

### User Story 2 - Comprador vê uma loja de perfumes e bijuterias da Dona Frida (Priority: P1)

O comprador acessa o site e vê a marca Dona Frida, sem nenhuma menção a impressão 3D ou Voxelas Duo. Isso vale para o título da página, o cabeçalho, o rodapé, as telas de erro e 404, o cadastro, o login e os e-mails recebidos.

**Why this priority**: um resquício da marca antiga confunde o cliente e compromete a confiança na loja.

**Independent Test**: navegar por home, catálogo, produto, carrinho, cadastro, login, 404 e erro, e receber os e-mails de cadastro e de pedido. Nenhum ponto pode citar Voxelas, 3D, impressão ou filamento.

**Acceptance Scenarios**:

1. **Given** qualquer página pública, **When** o comprador a visita, **Then** o nome exibido e o título da aba são "Dona Frida".
2. **Given** uma compra concluída, **When** o comprador recebe o e-mail de confirmação, **Then** o remetente, o assunto, a assinatura e a logo são da Dona Frida.
3. **Given** uma URL inexistente, **When** o comprador a acessa, **Then** vê a página 404 com textos da Dona Frida, sem a ilustração de 3D.
4. **Given** qualquer página, **When** ela carrega, **Then** nenhum widget de chat de terceiros é carregado.

---

### User Story 3 - Ficha técnica de perfume e bijuteria (Priority: P2)

Ao cadastrar um produto, a admin preenche a ficha técnica com campos próprios do negócio. Para perfume: volume (ml), gênero (feminino, masculino, unissex), família olfativa e "inspirado em". Para bijuteria: material, banho (ouro, prata, ródio, sem banho) e tamanho. Em ambos: marca e modelo. Todos os campos são opcionais, e o que for preenchido aparece na página do produto.

**Why this priority**: informa o comprador e alimenta os anúncios nos canais, mas o produto pode ser vendido sem ela.

**Independent Test**: cadastrar um perfume com volume 25 ml, gênero feminino e marca "Brand Collection" e conferir esses dados na página do produto.

**Acceptance Scenarios**:

1. **Given** um perfume com volume, gênero, família olfativa, "inspirado em" e marca preenchidos, **When** o comprador abre a página do produto, **Then** vê esses dados na ficha técnica.
2. **Given** uma bijuteria com material "aço inoxidável" e banho "ouro", **When** a página é aberta, **Then** a ficha mostra material e banho.
3. **Given** uma ficha técnica vazia, **When** a página é aberta, **Then** a seção de ficha técnica não aparece.
4. **Given** o formulário, **When** a admin procura "cor do cabo" ou campos de peça impressa, **Then** eles não existem.

---

### User Story 4 - Cliente pede uma encomenda em quantidade (Priority: P2)

Um cliente (ex.: revendedora ou empresa comprando brindes) quer comprar mais unidades do que o estoque disponível ou um produto que está esgotado. Ele preenche o formulário de encomenda informando o produto de interesse, a quantidade, os contatos e observações. A loja recebe um aviso por e-mail, e o cliente recebe a confirmação de que o pedido foi recebido.

**Why this priority**: gera vendas de maior volume, mas é um canal complementar à compra direta.

**Independent Test**: enviar uma encomenda de 30 unidades de um perfume e verificar o e-mail recebido pela loja com produto, quantidade e contatos.

**Acceptance Scenarios**:

1. **Given** a página de encomendas, **When** o cliente escolhe um produto do catálogo, informa a quantidade 30, os contatos e envia, **Then** a encomenda é registrada, a loja recebe o aviso e o cliente recebe a confirmação.
2. **Given** a página de um produto esgotado, **When** o cliente clica em "Encomendar", **Then** chega ao formulário com o produto já selecionado.
3. **Given** uma quantidade menor que 1 ou vazia, **When** o cliente envia, **Then** o sistema pede uma quantidade válida.
4. **Given** um produto que não está no catálogo, **When** o cliente usa o campo de observações para descrevê-lo, **Then** a encomenda é aceita sem produto selecionado.

---

### User Story 5 - Loja pronta para configurar com as contas da nova empresa (Priority: P1)

O responsável técnico configura o projeto com as contas da Dona Frida (banco de dados, armazenamento de imagens, Mercado Pago, Mercado Livre, Shopee, login Google, e-mail transacional, autenticação e agendamento), guiado por um arquivo de exemplo de variáveis que explica onde obter cada chave. O projeto é publicado em um projeto novo na Vercel, sem compartilhar nenhum dado ou credencial com o Voxelas Duo.

**Why this priority**: sem isso a loja não funciona em produção.

**Independent Test**: preencher as variáveis a partir do arquivo de exemplo, publicar e acessar o site e o painel. Os dados gravados vão para uma base separada da do Voxelas Duo.

**Acceptance Scenarios**:

1. **Given** o arquivo de exemplo de variáveis, **When** o responsável o lê, **Then** cada chave tem a descrição de para que serve e onde obtê-la.
2. **Given** o projeto configurado, **When** um produto é cadastrado, **Then** ele é gravado na base da Dona Frida, não na do Voxelas Duo.
3. **Given** o código do projeto, **When** é inspecionado, **Then** não contém nenhuma credencial do Voxelas Duo.

---

### Edge Cases

- **Produto com custo não informado**: o simulador de preço mostra um aviso para informar o custo, em vez de calcular com zero.
- **Item adicional duplicado** (mesmo nome duas vezes): é permitido. A soma considera os dois.
- **Muitos itens adicionais**: o formulário aceita até 10 itens por produto.
- **Custo de compra zero** (ex.: produto ganho de brinde): é permitido, com aviso de que a margem sobre custo fica indefinida.
- **Encomenda de produto removido do catálogo**: a encomenda já registrada mantém o nome do produto informado no momento do envio.
- **Envio de formulário por robô**: continua bloqueado pela proteção anti-spam existente.
- **Variável de ambiente ausente**: a funcionalidade que depende dela mostra o erro claramente (ex.: canal "não configurado"), sem derrubar o restante do site.

## Requirements *(mandatory)*

### Functional Requirements

**Custo e preço**

- **FR-001**: O cadastro de produto MUST ter: custo de compra (R$), custo de embalagem (R$) e uma lista de itens adicionais, cada um com nome e valor (R$), com no máximo 10 itens.
- **FR-002**: O sistema MUST calcular o custo total = compra + embalagem + soma dos itens adicionais e exibir o detalhamento item a item.
- **FR-003**: O simulador de preço por canal MUST usar o custo total como base (preço sugerido, lucro, margem, alertas de prejuízo e de margem baixa), mantendo as taxas e as margens mínima e desejada já configuráveis.
- **FR-004**: O modo "preço de escala" e todos os campos e textos de impressão 3D MUST ser removidos (filamento, impressora, depreciação, energia, horas de impressão e de mão de obra, taxa de falha, margem de perda).
- **FR-005**: As telas que dependem do custo (simulação de promoções no Mercado Livre, "copiar custo de outro produto", duplicar produto) MUST continuar funcionando com o novo custo.

**Marca e conteúdo**

- **FR-006**: Todos os textos, títulos, metadados, e-mails e telas de erro/404 MUST usar a marca Dona Frida e o contexto de perfumes e bijuterias. Nenhuma menção a Voxelas Duo, 3D, impressão ou filamento pode permanecer visível.
- **FR-007**: A identidade visual provisória (cores e fontes atuais) MAY permanecer até o redesign (EDI-116), mas logos e imagens da Voxelas Duo MUST ser substituídos por um placeholder da Dona Frida.
- **FR-008**: O widget de chat de terceiros MUST ser removido.

**Ficha técnica**

- **FR-009**: A ficha técnica MUST oferecer, todos opcionais: marca, modelo, volume (ml), gênero (feminino, masculino, unissex), família olfativa, "inspirado em", material, banho (ouro, prata, ródio, sem banho), tamanho e itens inclusos.
- **FR-010**: A página do produto MUST exibir apenas os campos preenchidos da ficha técnica.
- **FR-011**: Os anúncios nos canais externos MUST receber os dados da ficha técnica que tiverem equivalente no canal (ex.: marca, modelo, gênero, volume). Campos de 3D (ex.: "cor do cabo") MUST deixar de ser enviados.

**Encomendas**

- **FR-012**: O formulário de encomenda MUST pedir: produto de interesse (do catálogo, opcional), quantidade (inteiro ≥ 1, obrigatório), nome, e-mail, telefone e observações.
- **FR-013**: O produto de interesse MUST poder vir pré-selecionado a partir da página do produto (link "Encomendar").
- **FR-014**: Os e-mails de aviso à loja e de confirmação ao cliente MUST incluir produto (quando houver) e quantidade.

**Configuração e publicação**

- **FR-015**: O arquivo de exemplo de variáveis MUST listar e explicar todas as chaves necessárias: MongoDB, Vercel Blob, Mercado Pago, Mercado Livre, Shopee, Google OAuth, Resend, NextAuth (admin e cliente), Cron, URL do site e e-mails da loja.
- **FR-016**: O projeto MUST usar uma base de dados própria da Dona Frida e não conter nenhuma credencial, token ou arquivo de conta do Voxelas Duo.
- **FR-017**: Estoque, carrinho, checkout, pagamentos, pedidos, contas de cliente, avaliações, integrações de canais, feed do catálogo da Meta e banners da home MUST continuar funcionando como no Voxelas Duo.

### Key Entities

- **Custo do produto**: custo de compra, custo de embalagem e lista de itens adicionais (nome e valor). Substitui o antigo "custo de produção" de impressão 3D.
- **Ficha técnica**: marca, modelo, volume, gênero, família olfativa, "inspirado em", material, banho, tamanho e itens inclusos.
- **Encomenda**: produto de interesse (referência e nome no momento do pedido), quantidade, nome, e-mail, telefone, observações e data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A admin cadastra o custo completo de um produto (compra, embalagem e 2 itens adicionais) em menos de 1 minuto.
- **SC-002**: O custo total exibido bate, centavo a centavo, com a soma manual de compra + embalagem + itens em 100% dos casos testados.
- **SC-003**: Zero ocorrências das palavras "Voxelas", "3D", "impressão/impressora" ou "filamento" nas páginas públicas, no painel e nos e-mails.
- **SC-004**: Um cliente envia uma encomenda em quantidade em menos de 2 minutos, e a loja recebe o aviso com produto e quantidade.
- **SC-005**: Um responsável técnico configura e publica a loja só com o arquivo de exemplo de variáveis, sem consultar o código.
- **SC-006**: Todas as funcionalidades herdadas (compra ponta a ponta com pagamento, pedidos, estoque e canais) continuam funcionando após a adaptação.

## Assumptions

- O redesign visual completo (paleta rosa/nude, layout da referência) é o EDI-116. Nesta entrega a aparência atual continua, só com a marca trocada.
- A estrutura multi-idioma (i18n) não faz parte desta entrega. Os textos continuam em pt-BR, no mesmo padrão do código herdado.
- A sincronização automática com a loja do Facebook via API é o EDI-118. O feed do catálogo da Meta herdado continua disponível.
- O repositório no GitHub e a conexão com a Vercel são feitos pelo usuário (EDI-119). Nesta entrega o repositório é apenas local.
- A base começa vazia: não há migração de dados do Voxelas Duo.
- Nos canais externos, atributos obrigatórios específicos de cada categoria (perfume ou bijuteria) que não tiverem campo na ficha técnica serão tratados quando a publicação indicar a falta.
- Logo e fotos definitivas serão enviados pelo usuário. Até lá, um placeholder textual "Dona Frida".
