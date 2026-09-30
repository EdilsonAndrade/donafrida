import type { ObjectId } from "mongodb";

export const PRODUTOS_COLLECTION = "produtos";

/** IDs do anúncio correspondente em cada canal externo — ausência = produto sem anúncio naquele canal. */
export interface IntegracoesCanal {
  mercadoLivreId?: string;
  /** URL pública do anúncio, devolvida pela API na criação (`item.permalink`) — não reconstruir manualmente (ver anuncios.ts). */
  mercadoLivrePermalink?: string;
  /** `true` quando o anúncio foi pausado (não despublicado) — distinto de ausência de `mercadoLivreId` (nunca publicado) ou despublicação (fechado, `mercadoLivreId` removido). */
  mercadoLivrePausado?: boolean;
  /** Categoria (folha) escolhida manualmente para o anúncio — ausente = o previsor do Mercado Livre decide pelo título (ver anuncios.ts). */
  mercadoLivreCategoriaId?: string;
  /** Caminho legível da categoria escolhida (ex: "Casa > Decoração > Estatuetas") — só para exibir no admin sem consultar a API. */
  mercadoLivreCategoriaCaminho?: string;
  /** Tipo de anúncio no Mercado Livre — usado tanto pra publicar de verdade quanto pra simular a comissão real (EDI-108, correção: simulador só considerava Clássico). Ausente = "gold_special" (Clássico), mesmo comportamento de sempre. */
  mercadoLivreTipoAnuncio?: "gold_special" | "gold_pro";
  shopeeItemId?: string;
}

/** Item que acompanha a venda e entra no custo (ex: sacola de presente, amostra brinde). */
export interface ItemAdicionalCusto {
  nome: string;
  /** Em centavos, mesma convenção de `Produto.preco`. */
  valorCentavos: number;
}

/** Máximo de itens adicionais por produto. */
export const MAX_ITENS_ADICIONAIS_CUSTO = 10;

/**
 * Custo de um produto revendido — base da precificação por canal. Custo total
 * = compra + embalagem + soma dos itens adicionais. Valores em centavos.
 */
export interface CustoProduto {
  /** Quanto a loja pagou por uma unidade do produto. */
  custoCompraCentavos: number;
  /** Embalagem por unidade (caixa, papel de seda, fita etc.). */
  custoEmbalagemCentavos: number;
  /** Itens que acompanham cada venda — lista vazia quando não há. */
  itensAdicionais: ItemAdicionalCusto[];
}

/**
 * Taxas dos canais sobrescritas para este produto (EDI-106) — cada campo é
 * opcional; ausente = herda o padrão global (`TaxasCanaisConfig`).
 */
export interface TaxasCanaisProduto {
  shopeeTaxaPercentual?: number;
  siteTaxaPercentual?: number;
  siteTaxaFixaCentavos?: number;
  /** Override da margem mínima só deste produto — ausente = usa o padrão global (EDI-108). */
  margemMinimaPercentual?: number;
  /** Override da margem desejada só deste produto — ausente = usa o padrão global (EDI-108, correção: antes não era salva). */
  margemDesejadaPercentual?: number;
}

/**
 * Preços de venda por canal quando diferentes do preço do site (`Produto.preco`)
 * — ausente num canal = esse canal usa o preço do site também (EDI-108).
 * Em centavos, mesma convenção de `Produto.preco`.
 */
export interface PrecosCanaisProduto {
  mercadoLivre?: number;
  shopee?: number;
}

/**
 * Peso e dimensões da embalagem pronta para envio — inclui proteção/caixa. Usado
 * para informar o Mercado Livre e obter um frete condizente com o produto
 * real (EDI-96).
 */
export interface EmbalagemEnvio {
  /** Peso da embalagem pronta para envio, em gramas. */
  pesoGramas: number;
  /** Altura da embalagem, em centímetros. */
  alturaCm: number;
  /** Largura da embalagem, em centímetros. */
  larguraCm: number;
  /** Comprimento da embalagem, em centímetros. */
  comprimentoCm: number;
}

export const GENEROS_PRODUTO = ["feminino", "masculino", "unissex"] as const;
export type GeneroProduto = (typeof GENEROS_PRODUTO)[number];

export const BANHOS_BIJUTERIA = ["ouro", "prata", "rodio", "sem_banho"] as const;
export type BanhoBijuteria = (typeof BANHOS_BIJUTERIA)[number];

export const ROTULOS_GENERO: Record<GeneroProduto, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Unissex",
};

export const ROTULOS_BANHO: Record<BanhoBijuteria, string> = {
  ouro: "Ouro",
  prata: "Prata",
  rodio: "Ródio",
  sem_banho: "Sem banho",
};

/**
 * Ficha técnica opcional de perfumes e bijuterias — todos os campos são
 * individualmente opcionais; a página do produto mostra só os preenchidos e
 * os canais recebem os que tiverem atributo equivalente. Dimensões e peso de
 * envio ficam em `EmbalagemEnvio`, não aqui.
 */
export interface FichaTecnicaProduto {
  /** Marca do produto (ex: "Brand Collection") — atributo BRAND no Mercado Livre. */
  marca?: string;
  /** Modelo/linha (atributo MODEL no Mercado Livre). */
  modelo?: string;
  /** Perfume: volume do frasco, em ml. */
  volumeMl?: number;
  genero?: GeneroProduto;
  /** Perfume: família olfativa (ex: "Floral frutado"). */
  familiaOlfativa?: string;
  /** Perfume: fragrância de referência (ex: "Good Girl"). */
  inspiradoEm?: string;
  /** Bijuteria: material (ex: "Aço inoxidável", "Latão"). */
  material?: string;
  /** Bijuteria: banho. */
  banho?: BanhoBijuteria;
  /** Bijuteria: tamanho (ex: "Aro 16", "45 cm"). */
  tamanho?: string;
  /** O que acompanha o produto na embalagem — um item por posição da lista. */
  itensInclusos?: string[];
}

/** Limites de texto do catálogo da Meta (especificação de dados de produtos online). */
export const LIMITE_TITULO_META = 200;
export const LIMITE_DESCRICAO_META = 9999;

/**
 * Publicação no catálogo da Meta (Facebook/Instagram Shop) — EDI-109. Não há
 * ID de anúncio externo: a Meta lê o feed `/api/feeds/meta` e usa o `_id` do
 * produto como identificador do item.
 */
export interface MetaCatalogoProduto {
  /** `true` = o produto entra no feed do catálogo. */
  publicar: boolean;
  /** Título chamativo próprio para Facebook/Instagram — ausente = usa `nome`. */
  titulo?: string;
  /** Descrição própria para Facebook/Instagram — ausente = usa `descricao`. */
  descricao?: string;
}

export interface Produto {
  _id?: ObjectId;
  nome: string;
  /** Identificador de URL, único dentro da categoria (/produtos/[categoria]/[slug]). */
  slug: string;
  descricao: string;
  /** Preço de venda em centavos, para evitar erros de ponto flutuante. */
  preco: number;
  fotos: string[];
  estoque: number;
  categoria: string;
  integracoes?: IntegracoesCanal;
  /** Custo do produto (compra + embalagem + itens adicionais) — ausente = ainda não configurado. */
  custoProduto?: CustoProduto;
  /** Taxas de canal próprias deste produto — ausente/vazio = usa o padrão global (EDI-106). */
  taxasCanais?: TaxasCanaisProduto;
  /** Preço de venda próprio por canal — ausente/vazio = usa `preco` (o preço do site) também nesse canal (EDI-108). */
  precosCanais?: PrecosCanaisProduto;
  /** Dados de embalagem para cálculo de frete no Mercado Livre — ausente = ainda não configurado (EDI-96). */
  embalagemEnvio?: EmbalagemEnvio;
  /** Ficha técnica opcional (perfume/bijuteria) — ausente = não preenchida. */
  fichaTecnica?: FichaTecnicaProduto;
  /** Publicação no catálogo da Meta (Facebook/Instagram Shop) — ausente = não publicado (EDI-109). */
  metaCatalogo?: MetaCatalogoProduto;
  criadoEm: Date;
  atualizadoEm: Date;
}
