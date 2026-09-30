# Research: Projeto base Dona Frida

## 1. Cópia do código
- **Decision**: copiar a árvore do voxelasduo-app excluindo `.git`, `node_modules`, `.next`, `.env.local`, `atlas-credentials.env`, o JSON do Google, `tsconfig.tsbuildinfo`, `specs/` e `.mcp.json` (tem o token do Mercado Pago da Voxelas). Recriar `.mcp.json` só com o Linear. Rodar `git init` com a branch do EDI-115.
- **Rationale**: FR-016 (nenhuma credencial herdada) e um histórico limpo.

## 2. Modelo de custo
- **Decision**: substituir `custoProducao` por `custoProduto { custoCompraCentavos, custoEmbalagemCentavos, itensAdicionais: { nome, valorCentavos }[] }`, com `calcularCustoProduto()` devolvendo o detalhamento e o total.
- **Rationale**: a base começa vazia, então não há documentos antigos a migrar, e o nome novo evita confusão com "produção".
- **Alternatives**: reaproveitar `custoProducao` zerando os campos 3D. Descartado porque deixaria o modelo enganoso.

## 3. Preço de escala
- **Decision**: remover `calcularPrecoEscala`, o modo "escala", o custo de caixa, a depreciação e o lucro por hora do simulador.
- **Rationale**: o conceito depende de impressora ociosa. Na revenda, todo custo é caixa.

## 4. Ficha técnica
- **Decision**: `FichaTecnicaProduto { marca, modelo, volumeMl, genero, familiaOlfativa, inspiradoEm, material, banho, tamanho, itensInclusos }`, todos opcionais. Saem `alturaCm/larguraCm/comprimentoCm/pesoGramas/corCabo` da ficha (as dimensões de envio continuam em `embalagemEnvio`).
- **Enums**: `genero` ∈ feminino | masculino | unissex; `banho` ∈ ouro | prata | rodio | sem_banho.

## 5. Mercado Livre
- **Decision**: `BRAND` = `ficha.marca` (fallback "Dona Frida"), `MODEL` = `ficha.modelo`, `GENDER` pelo gênero (Feminino/Masculino/Sem gênero), `UNIT_VOLUME` = "`N` mL", `MATERIAL` e `PLATING`/`METAL_PLATING` quando a categoria tiver esses atributos. Remover `CABLE_COLOR`. Só envia atributos que existem na categoria (lógica atual de `idsCategoria`).

## 6. Meta (feed)
- **Decision**: `brand` = `ficha.marca` ou "Dona Frida"; `gender` (female/male/unisex) quando houver.

## 7. Encomendas
- **Decision**: adicionar `produtoId?`, `produtoNome?` (snapshot no envio) e `quantidade` (inteiro ≥ 1, até 10.000). `descricao` vira "observações", opcional quando há produto e obrigatória quando não há. Pré-seleção via `/encomendas?produto=<id>`.

## 8. Marca e ativos
- **Decision**: remover `logo.png`, `bkplogo.jpeg`, `cores.jpeg`, `encomendas.png` e `logo-email.png` da Voxelas. O cabeçalho usa a marca textual "Dona Frida" (fonte display). O e-mail usa cabeçalho textual. A ilustração 3D das telas de erro sai; fica tipográfica.

## 9. Widget de chat
- **Decision**: remover o `<script>` da InterasisAI (decisão do usuário).

## 10. Chaves de navegador
- **Decision**: `donafrida-theme` e `donafrida-carrinho` no localStorage, para não colidir com dados do Voxelas no mesmo navegador de desenvolvimento.
