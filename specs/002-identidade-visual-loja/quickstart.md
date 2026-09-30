# Test Guide — Identidade visual e layout da loja Dona Frida (EDI-116)

**Pré-requisito**: `npm ci` feito e `.env` preenchido. Suba a aplicação você mesmo com
`npm run dev` — o agente não sobe servidor.

Para ver a home com conteúdo, é preciso ter pelo menos um banner hero e um carrossel ativos em
`/admin/banners`. Sem nenhuma seção ativa, `/` continua redirecionando para `/produtos`, que é
o comportamento esperado.

---

## 1. A identidade trocou (US1)

1. Acesse `http://localhost:3000/produtos`.
2. Confirme: fundo branco, cartões com contorno nude fino, títulos em serifa de traço fino
   (Bodoni) e texto em sem serifa geométrica (Jost).
3. Nenhum laranja, roxo, turquesa ou amarelo deve aparecer em lugar nenhum.
4. Navegue só pelo teclado (Tab). Cada link e botão precisa mostrar um anel de foco visível.
5. Abra o DevTools → Elements, selecione o `<html>` e confirme que **não há** atributo
   `data-theme`. No console, rode `localStorage.getItem("donafrida-theme")` — deve vir `null`.
6. Procure o botão de alternar tema: ele não existe mais em nenhuma tela.

## 2. Home e rodapé (US2)

1. Acesse `http://localhost:3000/` com um banner hero ativo.
2. No topo da página, o cabeçalho deve estar **transparente sobre a imagem** do hero.
3. Role a página: o cabeçalho ganha fundo sólido e contorno inferior.
4. Entre as seções, confirme o **fio de contas** (fileira de círculos nude) no lugar de uma
   linha reta.
5. Num carrossel com mais itens do que cabem na tela, confirme que a paginação também é o fio
   de contas, com a conta atual preenchida.
6. Role até o fim: o rodapé rosa precisa ter as colunas de navegação, as redes sociais, o bloco
   de novidades, o aviso de direitos autorais e o link de termos e políticas.
7. Se `NEXT_PUBLIC_LOJA_WHATSAPP` estiver preenchido, o bloco de novidades convida pelo
   WhatsApp com link real. Apague a variável, reinicie e confirme que o bloco passa a mostrar o
   campo de e-mail desabilitado com a nota de que a inscrição ainda não está aberta — e que o
   ícone de WhatsApp some do rodapé sem deixar buraco.
8. Desative todas as seções em `/admin/banners` e acesse `/`: deve continuar levando a
   `/produtos`.

## 3. Navegação, busca e carrinho (US3)

1. Em qualquer página, confirme no cabeçalho: marca à esquerda, categorias ao lado, e busca,
   conta e carrinho à direita.
2. Se houver mais de 5 categorias com produto publicado, as excedentes precisam estar dentro do
   item **"Mais"**.
3. Digite um termo na busca do cabeçalho e envie: você deve cair em
   `/produtos?q=<termo>` já filtrado.
4. Sem sessão, clique no ícone de conta: devem aparecer **Entrar** e **Criar conta**.
5. Entre com uma conta de cliente e clique de novo: devem aparecer **Pedidos**, **Perfil** e
   **Sair**.
6. Abra um produto e clique em adicionar ao carrinho: o **painel lateral** deve abrir pela
   direita com o item, o subtotal e os botões de continuar comprando e finalizar.
7. Com o painel aberto, tente rolar a página por trás — não pode rolar.
8. Pressione **Esc**: o painel fecha e o foco volta para o botão do carrinho.
9. Remova todos os itens e reabra o painel: deve mostrar a mensagem de carrinho vazio, o botão
   "Voltar à loja" e, se você estiver deslogado, o convite para entrar.
10. Acesse `/carrinho` direto na URL: a página precisa mostrar os mesmos itens do painel.
11. Confirme que o contador do ícone do carrinho bate com a quantidade de itens.

## 4. Painel e telas internas (US4)

1. Percorra: `/admin/login`, `/admin/produtos`, `/admin/produtos/novo`, `/admin/banners`,
   `/admin/pedidos`, `/admin/configuracoes`.
2. Percorra: `/entrar`, `/cadastro`, `/minha-conta`, `/minha-conta/pedidos`, `/checkout`,
   `/encomendas`.
3. Em nenhuma delas pode restar cor antiga, texto ilegível ou botão sem contorno visível.
4. Acesse uma URL inexistente, como `/pagina-que-nao-existe`, e confirme a página 404 na nova
   identidade, com o selo tipográfico da marca.
5. Force um erro de formulário (envie o formulário de produto sem nome, por exemplo): a
   mensagem de erro precisa aparecer em vermelho terracota, reconhecível como erro, e o status
   da requisição na aba **Network** precisa ser 4xx — não 200.

## 5. Celular e movimento

1. No DevTools, ative o modo dispositivo e escolha uma largura de **360px**.
2. Percorra home, catálogo, produto, carrinho e checkout: nenhuma tela pode ter rolagem
   horizontal.
3. Abra o menu recolhido do cabeçalho e confirme que todas as categorias e os acessos de conta
   estão lá.
4. Abra o painel do carrinho nessa largura: ele precisa caber na tela.
5. Ative a preferência de movimento reduzido (DevTools → Rendering →
   `prefers-reduced-motion: reduce`) e confirme que o painel do carrinho e os carrosséis não
   animam mais.

## 6. Verificação técnica

Rode você mesmo, na raiz do projeto:

```
npx tsc --noEmit
npx vitest run
```

Ambos precisam terminar limpos. O teste novo é `lib/site/navegacao.test.ts`.

---

## O que NÃO faz parte desta entrega

- Guardar e-mail da newsletter (o bloco é visual).
- Preço promocional real: o selo existe, mas fica oculto até o **EDI-122** criar o campo.
- Estrutura de i18n: os textos novos continuam em pt-BR inline, e serão extraídos no
  **EDI-121**.
