# Quickstart / Test Guide: Projeto base Dona Frida

1. Em `C:\projects\donafrida`, copie `.env.example` para `.env.local` e preencha as chaves da conta da Dona Frida (MongoDB novo, Blob, `AUTH_SECRET`, `AUTH_CLIENTE_SECRET` etc.), incluindo as novas `LOJA_EMAIL_CONTATO` e `NEXT_PUBLIC_LOJA_WHATSAPP`.
2. Rode `npm install`, `npm run seed:admin` (cria o usuário do painel) e, opcionalmente, `npm run seed` (perfumes e bijuterias de exemplo). Depois `npm run dev`.
3. Acesse `/`, `/produtos`, um produto, `/carrinho`, `/entrar`, `/cadastro` e uma URL inexistente. Em todas deve aparecer "Dona Frida", sem citar Voxelas ou 3D, e sem widget de chat.
4. No painel, crie um produto com compra R$ 32,00, embalagem R$ 3,50 e os itens "Sacola de presente" R$ 2,50 e "Amostra brinde" R$ 1,00. O custo total deve ser R$ 39,00, e o simulador deve partir desse valor, sem a opção "Preço de escala".
5. Na ficha técnica, preencha marca "Brand Collection", volume 25, gênero Feminino e "inspirado em" Good Girl. Salve e abra a página do produto: a ficha aparece com esses dados.
6. Zere o estoque do produto e abra a página dele: há o link "Encomendar". Envie uma encomenda de 30 unidades e confira o aviso no `ADMIN_NOTIFICACAO_EMAIL`, com produto e quantidade.
7. Na aba Network, envie uma encomenda com quantidade 0: deve voltar `400` com `erros.quantidade`.
8. No MongoDB (base `donafrida`), confira:
   ```js
   db.produtos.findOne({}, { custoProduto: 1, fichaTecnica: 1 })
   db.encomendas.find().sort({ criadoEm: -1 }).limit(1)
   ```
9. No terminal, confirme que nada de 3D ou da marca antiga sobrou:
   ```bash
   grep -rniE "voxelas|impress[ãa]o 3d|filamento" app components lib scripts
   ```
   Deve retornar vazio.
