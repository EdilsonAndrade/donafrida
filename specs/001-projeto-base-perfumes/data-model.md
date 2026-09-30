# Data Model: Projeto base Dona Frida

## Produto (coleção `produtos`), campos alterados

```ts
interface ItemAdicionalCusto {
  nome: string;           // 1..60 caracteres
  valorCentavos: number;  // inteiro ≥ 0
}

interface CustoProduto {
  custoCompraCentavos: number;     // ≥ 0
  custoEmbalagemCentavos: number;  // ≥ 0
  itensAdicionais: ItemAdicionalCusto[];  // 0..10
}

interface FichaTecnicaProduto {     // todos opcionais
  marca?: string;          // ≤ 60
  modelo?: string;         // ≤ 60
  volumeMl?: number;       // inteiro 1..5000
  genero?: "feminino" | "masculino" | "unissex";
  familiaOlfativa?: string;  // ≤ 60 (ex.: "Floral frutado")
  inspiradoEm?: string;      // ≤ 80 (ex.: "Good Girl")
  material?: string;         // ≤ 60 (ex.: "Aço inoxidável")
  banho?: "ouro" | "prata" | "rodio" | "sem_banho";
  tamanho?: string;          // ≤ 40 (ex.: "Aro 16", "45 cm")
  itensInclusos?: string[];
}

interface Produto {
  // ...inalterados
  custoProduto?: CustoProduto;   // substitui custoProducao
  fichaTecnica?: FichaTecnicaProduto;
}
```

**Cálculo** (`calcularCustoProduto`): `total = compra + embalagem + Σ itens.valor`, retornando `{ custoCompraCentavos, custoEmbalagemCentavos, itensAdicionais, totalItensAdicionaisCentavos, totalCentavos }`.

## Encomenda (coleção `encomendas`)

```ts
interface Encomenda {
  _id?: ObjectId;
  produtoId?: ObjectId;     // produto do catálogo, quando escolhido
  produtoNome?: string;     // snapshot do nome no envio
  quantidade: number;       // inteiro 1..10000
  nome: string;
  email: string;            // minúsculas
  telefone: string;         // só dígitos, 10–11
  descricao?: string;       // observações; obrigatória sem produtoId
  criadoEm: Date;
}
```
