import type { ObjectId } from "mongodb";

export const ENCOMENDAS_COLLECTION = "encomendas";

/**
 * Pedido de encomenda em quantidade (ex.: revenda, brindes) de um produto da
 * loja — enviado pelo formulário público de /encomendas.
 */
export interface Encomenda {
  _id?: ObjectId;
  /** Produto do catálogo, quando o cliente escolheu um. */
  produtoId?: ObjectId;
  /** Nome do produto no momento do envio (snapshot — continua legível se o produto sair do catálogo). */
  produtoNome?: string;
  /** Quantidade desejada, inteiro ≥ 1. */
  quantidade: number;
  nome: string;
  /** Sempre normalizado em minúsculas antes de gravar. */
  email: string;
  /** Somente dígitos, com DDD (10 ou 11 dígitos). */
  telefone: string;
  /** Observações; obrigatória quando não há produto escolhido. */
  descricao?: string;
  criadoEm: Date;
}
