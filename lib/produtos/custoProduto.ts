import type { CustoProduto, ItemAdicionalCusto } from "@/lib/models/produto";

/** Detalhamento e total do custo de um produto revendido, em centavos. */
export interface ResultadoCusto {
  custoCompraCentavos: number;
  custoEmbalagemCentavos: number;
  itensAdicionais: ItemAdicionalCusto[];
  /** Soma dos itens adicionais (0 quando não há). */
  totalItensAdicionaisCentavos: number;
  /** Compra + embalagem + itens adicionais — base da precificação por canal. */
  totalCentavos: number;
}

/**
 * Custo total do produto = compra + embalagem + soma dos itens adicionais.
 * Função pura, sem I/O, para recálculo instantâneo no formulário. Cada valor
 * é arredondado para centavos antes da soma, para o total bater exatamente
 * com o detalhamento exibido.
 */
export function calcularCustoProduto(custo: CustoProduto): ResultadoCusto {
  const custoCompraCentavos = Math.round(custo.custoCompraCentavos);
  const custoEmbalagemCentavos = Math.round(custo.custoEmbalagemCentavos);
  const itensAdicionais = (custo.itensAdicionais ?? []).map((item) => ({
    nome: item.nome,
    valorCentavos: Math.round(item.valorCentavos),
  }));
  const totalItensAdicionaisCentavos = itensAdicionais.reduce((soma, item) => soma + item.valorCentavos, 0);

  return {
    custoCompraCentavos,
    custoEmbalagemCentavos,
    itensAdicionais,
    totalItensAdicionaisCentavos,
    totalCentavos: custoCompraCentavos + custoEmbalagemCentavos + totalItensAdicionaisCentavos,
  };
}
