import {
  BANHOS_BIJUTERIA,
  GENEROS_PRODUTO,
  LIMITE_DESCRICAO_META,
  LIMITE_TITULO_META,
  MAX_ITENS_ADICIONAIS_CUSTO,
} from "@/lib/models/produto";

export interface ProdutoPayload {
  nome?: unknown;
  descricao?: unknown;
  preco?: unknown;
  estoque?: unknown;
  categoria?: unknown;
  fotos?: unknown;
  /** IDs do anúncio em cada canal externo (Tarefa 5) — opcional, sem anúncio ainda em nenhum canal por padrão. */
  integracoes?: unknown;
  /** Custo do produto (compra + embalagem + itens adicionais) — opcional, produto pode ser salvo sem custo configurado. */
  custoProduto?: unknown;
  /** Peso/dimensões da embalagem para envio (EDI-96) — opcional, produto pode ser salvo sem esses dados configurados. */
  embalagemEnvio?: unknown;
  /** Ficha técnica opcional (perfume/bijuteria) — produto pode ser salvo sem nenhum campo preenchido. */
  fichaTecnica?: unknown;
  /** Taxas de canal próprias do produto (EDI-106) — opcional; ausente/vazio = herda o padrão global. */
  taxasCanais?: unknown;
  /** Preços de venda próprios por canal (EDI-108) — opcional; ausente/vazio = usa `preco` (o preço do site) também nesse canal. */
  precosCanais?: unknown;
  /** Publicação no catálogo da Meta (EDI-109) — opcional; ausente = não publicado. */
  metaCatalogo?: unknown;
}

function numeroFinito(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function centavosValidos(valor: unknown): boolean {
  return numeroFinito(valor) && Number.isInteger(valor) && valor >= 0;
}

/**
 * Valida `custoProduto` quando presente: compra e embalagem obrigatórias
 * (inteiros ≥ 0, em centavos) e até 10 itens adicionais, cada um com nome
 * (1–60 caracteres) e valor ≥ 0.
 */
function validarCustoProduto(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de custo do produto inválido.";
  }

  const custo = valor as Record<string, unknown>;

  if (!centavosValidos(custo.custoCompraCentavos)) {
    return "Informe o custo de compra (zero ou mais).";
  }
  if (!centavosValidos(custo.custoEmbalagemCentavos)) {
    return "Informe o custo de embalagem (zero ou mais).";
  }

  const itens = custo.itensAdicionais;
  if (!Array.isArray(itens)) {
    return "Formato dos itens adicionais inválido.";
  }
  if (itens.length > MAX_ITENS_ADICIONAIS_CUSTO) {
    return `Informe no máximo ${MAX_ITENS_ADICIONAIS_CUSTO} itens adicionais.`;
  }
  for (const [indice, item] of itens.entries()) {
    const dados = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
    const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
    if (nome.length === 0 || nome.length > 60) {
      return `Informe o nome do item adicional ${indice + 1} (até 60 caracteres).`;
    }
    if (!centavosValidos(dados.valorCentavos)) {
      return `Informe um valor válido (zero ou mais) para "${nome}".`;
    }
  }

  return undefined;
}

/**
 * Valida `taxasCanais` quando presente no payload (EDI-106): cada campo é
 * individualmente opcional; taxas em 0 ≤ x < 100, margens ≥ 0 e taxa fixa ≥ 0.
 */
function validarTaxasCanais(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de taxas dos canais inválido.";
  }

  const taxas = valor as Record<string, unknown>;

  for (const campo of ["shopeeTaxaPercentual", "siteTaxaPercentual"] as const) {
    if (taxas[campo] === undefined) continue;
    if (!numeroFinito(taxas[campo]) || (taxas[campo] as number) < 0 || (taxas[campo] as number) >= 100) {
      return `Informe um percentual entre 0 e menos de 100 para "${campo}".`;
    }
  }

  if (taxas.siteTaxaFixaCentavos !== undefined) {
    if (!numeroFinito(taxas.siteTaxaFixaCentavos) || taxas.siteTaxaFixaCentavos < 0) {
      return 'A taxa fixa do site próprio não pode ser negativa.';
    }
  }

  // Margens são sobre o custo, não sobre o preço — sem teto de 100%.
  if (taxas.margemMinimaPercentual !== undefined) {
    if (!numeroFinito(taxas.margemMinimaPercentual) || (taxas.margemMinimaPercentual as number) < 0) {
      return "Informe um percentual válido, maior ou igual a 0, para a margem mínima.";
    }
  }
  if (taxas.margemDesejadaPercentual !== undefined) {
    if (!numeroFinito(taxas.margemDesejadaPercentual) || (taxas.margemDesejadaPercentual as number) < 0) {
      return "Informe um percentual válido, maior ou igual a 0, para a margem desejada.";
    }
  }

  return undefined;
}

/**
 * Valida `precosCanais` quando presente no payload (EDI-108): cada canal é
 * individualmente opcional; quando informado, mesma regra de `preco`
 * (inteiro positivo em centavos).
 */
function validarPrecosCanais(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de preços dos canais inválido.";
  }

  const precos = valor as Record<string, unknown>;

  for (const campo of ["mercadoLivre", "shopee"] as const) {
    if (precos[campo] === undefined) continue;
    const preco = precos[campo];
    if (typeof preco !== "number" || !Number.isInteger(preco) || preco <= 0) {
      return `Informe um preço maior que zero para "${campo}".`;
    }
  }

  return undefined;
}

/**
 * Valida `metaCatalogo` quando presente no payload (EDI-109): `publicar`
 * obrigatório; título e descrição próprios opcionais, dentro dos limites da Meta.
 */
function validarMetaCatalogo(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de publicação no Facebook inválido.";
  }

  const meta = valor as Record<string, unknown>;

  if (typeof meta.publicar !== "boolean") {
    return "Informe se o produto deve ser publicado no Facebook/Instagram.";
  }

  if (meta.titulo !== undefined) {
    if (typeof meta.titulo !== "string") return "Título para o Facebook inválido.";
    if (meta.titulo.trim().length > LIMITE_TITULO_META) {
      return `O título para o Facebook deve ter no máximo ${LIMITE_TITULO_META} caracteres.`;
    }
  }

  if (meta.descricao !== undefined) {
    if (typeof meta.descricao !== "string") return "Descrição para o Facebook inválida.";
    if (meta.descricao.trim().length > LIMITE_DESCRICAO_META) {
      return `A descrição para o Facebook deve ter no máximo ${LIMITE_DESCRICAO_META} caracteres.`;
    }
  }

  return undefined;
}

/** Campos obrigatórios de `embalagemEnvio`, todos exigidos > 0 quando o objeto está presente (EDI-96). */
const CAMPOS_EMBALAGEM_ENVIO = ["pesoGramas", "alturaCm", "larguraCm", "comprimentoCm"] as const;

/** Valida `embalagemEnvio` quando presente no payload: todos os campos são obrigatórios e devem ser > 0 (data-model.md → "Validação"). */
function validarEmbalagemEnvio(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de embalagem para envio inválido.";
  }

  const embalagem = valor as Record<string, unknown>;

  for (const campo of CAMPOS_EMBALAGEM_ENVIO) {
    if (!numeroFinito(embalagem[campo]) || (embalagem[campo] as number) <= 0) {
      return `Informe um valor maior que zero para "${campo}".`;
    }
  }

  return undefined;
}

/** Campos de texto da ficha técnica e o tamanho máximo de cada um. */
const CAMPOS_FICHA_TECNICA_TEXTO = {
  marca: 60,
  modelo: 60,
  familiaOlfativa: 60,
  inspiradoEm: 80,
  material: 60,
  tamanho: 40,
} as const;

const ROTULOS_CAMPOS_FICHA: Record<keyof typeof CAMPOS_FICHA_TECNICA_TEXTO, string> = {
  marca: "a marca",
  modelo: "o modelo",
  familiaOlfativa: "a família olfativa",
  inspiradoEm: "o \"inspirado em\"",
  material: "o material",
  tamanho: "o tamanho",
};

/** Valida `fichaTecnica` quando presente: todos os campos são individualmente opcionais. */
function validarFichaTecnica(valor: unknown): string | undefined {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return "Formato de ficha técnica inválido.";
  }

  const ficha = valor as Record<string, unknown>;

  for (const [campo, limite] of Object.entries(CAMPOS_FICHA_TECNICA_TEXTO) as [
    keyof typeof CAMPOS_FICHA_TECNICA_TEXTO,
    number,
  ][]) {
    if (ficha[campo] === undefined) continue;
    if (!textoValido(ficha[campo]) || (ficha[campo] as string).trim().length > limite) {
      return `Informe ${ROTULOS_CAMPOS_FICHA[campo]} com até ${limite} caracteres, ou deixe em branco.`;
    }
  }

  if (ficha.volumeMl !== undefined) {
    const volume = ficha.volumeMl;
    if (!numeroFinito(volume) || !Number.isInteger(volume) || volume < 1 || volume > 5000) {
      return "Informe o volume em ml (número inteiro entre 1 e 5000).";
    }
  }

  if (ficha.genero !== undefined && !GENEROS_PRODUTO.includes(ficha.genero as never)) {
    return "Gênero inválido.";
  }

  if (ficha.banho !== undefined && !BANHOS_BIJUTERIA.includes(ficha.banho as never)) {
    return "Banho inválido.";
  }

  if (ficha.itensInclusos !== undefined) {
    const itens = ficha.itensInclusos;
    if (
      !Array.isArray(itens) ||
      !itens.every((item) => typeof item === "string" && item.trim().length > 0)
    ) {
      return "Os itens inclusos não podem estar vazios.";
    }
  }

  return undefined;
}

export type ErrosValidacao = Record<string, string>;

function textoValido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Valida o payload de criação/edição de produto.
 * `parcial: true` (edição via PATCH) só valida os campos presentes no payload.
 */
export function validarProduto(
  payload: ProdutoPayload,
  { parcial = false }: { parcial?: boolean } = {}
): ErrosValidacao {
  const erros: ErrosValidacao = {};
  const presente = (campo: keyof ProdutoPayload) =>
    !parcial || payload[campo] !== undefined;

  if (presente("nome") && !textoValido(payload.nome)) {
    erros.nome = "Informe o nome do produto.";
  }

  if (presente("descricao") && !textoValido(payload.descricao)) {
    erros.descricao = "Informe a descrição do produto.";
  }

  if (presente("categoria") && !textoValido(payload.categoria)) {
    erros.categoria = "Informe a categoria do produto.";
  }

  if (presente("preco")) {
    const preco = payload.preco;
    if (typeof preco !== "number" || !Number.isInteger(preco) || preco <= 0) {
      erros.preco = "O preço deve ser maior que zero.";
    }
  }

  if (presente("estoque")) {
    const estoque = payload.estoque;
    if (typeof estoque !== "number" || !Number.isInteger(estoque) || estoque < 0) {
      erros.estoque = "O estoque não pode ser negativo.";
    }
  }

  if (presente("integracoes") && payload.integracoes !== undefined) {
    const integracoes = payload.integracoes;
    if (typeof integracoes !== "object" || integracoes === null || Array.isArray(integracoes)) {
      erros.integracoes = "Formato de integrações inválido.";
    }
  }

  if (presente("fotos")) {
    const fotos = payload.fotos;
    if (!Array.isArray(fotos) || fotos.length === 0 || !fotos.every((f) => typeof f === "string" && f.length > 0)) {
      erros.fotos = "Envie ao menos uma foto do produto.";
    }
  }

  if (payload.custoProduto !== undefined) {
    const erro = validarCustoProduto(payload.custoProduto);
    if (erro) {
      erros.custoProduto = erro;
    }
  }

  if (payload.taxasCanais !== undefined) {
    const erro = validarTaxasCanais(payload.taxasCanais);
    if (erro) {
      erros.taxasCanais = erro;
    }
  }

  if (payload.precosCanais !== undefined) {
    const erro = validarPrecosCanais(payload.precosCanais);
    if (erro) {
      erros.precosCanais = erro;
    }
  }

  if (payload.metaCatalogo !== undefined) {
    const erro = validarMetaCatalogo(payload.metaCatalogo);
    if (erro) {
      erros.metaCatalogo = erro;
    }
  }

  if (payload.embalagemEnvio !== undefined) {
    const erro = validarEmbalagemEnvio(payload.embalagemEnvio);
    if (erro) {
      erros.embalagemEnvio = erro;
    }
  }

  if (payload.fichaTecnica !== undefined) {
    const erro = validarFichaTecnica(payload.fichaTecnica);
    if (erro) {
      erros.fichaTecnica = erro;
    }
  }

  return erros;
}
