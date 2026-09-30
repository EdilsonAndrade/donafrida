import { MAX_ITENS_ADICIONAIS_CUSTO, type CustoProduto } from "@/lib/models/produto";

/**
 * Valores do formulário de custo do produto — todos em texto (reais),
 * convertidos para centavos ao salvar.
 *
 * Vive fora de `ProdutoForm.tsx` (que é `"use client"`) porque é usado tanto
 * pelo formulário (client) quanto pela página de edição (Server Component) —
 * uma função exportada de um módulo `"use client"` não pode ser chamada a
 * partir do servidor, mesmo sendo pura.
 */
export interface ItemAdicionalFormValores {
  nome: string;
  valorReais: string;
}

export interface CustoProdutoFormValores {
  custoCompraReais: string;
  custoEmbalagemReais: string;
  itensAdicionais: ItemAdicionalFormValores[];
}

export const VAZIO_CUSTO_PRODUTO: CustoProdutoFormValores = {
  custoCompraReais: "",
  custoEmbalagemReais: "",
  itensAdicionais: [],
};

export const LIMITE_NOME_ITEM_ADICIONAL = 60;

function numeroDeTexto(valor: string): number {
  return Number(valor.trim().replace(",", "."));
}

function valorMonetarioValido(texto: string): boolean {
  if (texto.trim() === "") return false;
  const numero = numeroDeTexto(texto);
  return Number.isFinite(numero) && numero >= 0;
}

/**
 * Campos de custo ainda não preenchidos ou inválidos — usado para não
 * calcular um custo incompleto/enganoso no simulador.
 */
export function camposCustoProdutoFaltando(form: CustoProdutoFormValores): string[] {
  const faltando: string[] = [];
  if (!valorMonetarioValido(form.custoCompraReais)) faltando.push("custo de compra");
  if (!valorMonetarioValido(form.custoEmbalagemReais)) faltando.push("custo de embalagem");

  if (form.itensAdicionais.length > MAX_ITENS_ADICIONAIS_CUSTO) {
    faltando.push(`no máximo ${MAX_ITENS_ADICIONAIS_CUSTO} itens adicionais`);
  }
  form.itensAdicionais.forEach((item, indice) => {
    const nome = item.nome.trim();
    if (nome === "" || nome.length > LIMITE_NOME_ITEM_ADICIONAL) {
      faltando.push(`nome do item adicional ${indice + 1}`);
    }
    if (!valorMonetarioValido(item.valorReais)) {
      faltando.push(`valor do item adicional ${indice + 1}`);
    }
  });

  return faltando;
}

/** Formulário → `CustoProduto` (centavos); `null` se algum campo estiver faltando/inválido. */
export function montarCustoProduto(form: CustoProdutoFormValores): CustoProduto | null {
  if (camposCustoProdutoFaltando(form).length > 0) return null;

  const centavos = (texto: string) => Math.round(numeroDeTexto(texto) * 100);

  return {
    custoCompraCentavos: centavos(form.custoCompraReais),
    custoEmbalagemCentavos: centavos(form.custoEmbalagemReais),
    itensAdicionais: form.itensAdicionais.map((item) => ({
      nome: item.nome.trim(),
      valorCentavos: centavos(item.valorReais),
    })),
  };
}

/** `CustoProduto` salvo (centavos) → formulário em texto — usado ao editar/duplicar um produto. */
export function custoProdutoParaFormulario(custo?: CustoProduto): CustoProdutoFormValores {
  if (!custo) return VAZIO_CUSTO_PRODUTO;

  const reais = (centavos: number) => (centavos / 100).toFixed(2);

  return {
    custoCompraReais: reais(custo.custoCompraCentavos),
    custoEmbalagemReais: reais(custo.custoEmbalagemCentavos),
    itensAdicionais: (custo.itensAdicionais ?? []).map((item) => ({
      nome: item.nome,
      valorReais: reais(item.valorCentavos),
    })),
  };
}
