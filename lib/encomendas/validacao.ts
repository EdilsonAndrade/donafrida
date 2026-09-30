export interface EncomendaPayload {
  produtoId?: unknown;
  quantidade?: unknown;
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  descricao?: unknown;
}

export type ErrosValidacao = Record<string, string>;

/** Mínimo de caracteres das observações quando elas descrevem o produto (sem produto escolhido). */
export const DESCRICAO_TAMANHO_MINIMO = 10;
export const DESCRICAO_TAMANHO_MAXIMO = 2000;
export const QUANTIDADE_MAXIMA = 10000;
const NOME_TAMANHO_MAXIMO = 120;
const EMAIL_TAMANHO_MAXIMO = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function textoValido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Quantidade vinda do formulário (texto) ou da API (número) → número, ou `NaN` se inválida. */
export function quantidadeDeEntrada(valor: unknown): number {
  if (typeof valor === "number") return valor;
  if (typeof valor === "string" && /^\s*\d+\s*$/.test(valor)) return Number(valor.trim());
  return Number.NaN;
}

/**
 * Valida o formulário de encomenda. Quantidade, nome, e-mail e telefone são
 * obrigatórios. O produto é opcional; sem ele, as observações passam a ser
 * obrigatórias (é onde o cliente descreve o que quer). A existência do
 * produto no catálogo é checada na API, não aqui.
 */
export function validarEncomenda(payload: EncomendaPayload): ErrosValidacao {
  const erros: ErrosValidacao = {};
  const temProduto = textoValido(payload.produtoId);

  if (temProduto && !OBJECT_ID_REGEX.test((payload.produtoId as string).trim())) {
    erros.produtoId = "Produto inválido. Escolha um produto da lista.";
  }

  const quantidade = quantidadeDeEntrada(payload.quantidade);
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > QUANTIDADE_MAXIMA) {
    erros.quantidade = `Informe uma quantidade entre 1 e ${QUANTIDADE_MAXIMA.toLocaleString("pt-BR")}.`;
  }

  if (!textoValido(payload.nome)) {
    erros.nome = "Informe seu nome.";
  } else if (payload.nome.trim().length > NOME_TAMANHO_MAXIMO) {
    erros.nome = `O nome deve ter no máximo ${NOME_TAMANHO_MAXIMO} caracteres.`;
  }

  if (
    !textoValido(payload.email) ||
    payload.email.trim().length > EMAIL_TAMANHO_MAXIMO ||
    !EMAIL_REGEX.test(payload.email.trim())
  ) {
    erros.email = "Informe um e-mail válido.";
  }

  if (!textoValido(payload.telefone)) {
    erros.telefone = "Informe um telefone para contato.";
  } else {
    const digitos = somenteDigitos(payload.telefone);
    if (digitos.length < 10 || digitos.length > 11) {
      erros.telefone = "Informe um telefone válido com DDD.";
    }
  }

  if (!textoValido(payload.descricao)) {
    if (!temProduto) {
      erros.descricao = "Escolha um produto ou descreva o que você quer encomendar.";
    }
  } else {
    const tamanho = payload.descricao.trim().length;
    if (!temProduto && tamanho < DESCRICAO_TAMANHO_MINIMO) {
      erros.descricao = `Descreva um pouco mais (mínimo ${DESCRICAO_TAMANHO_MINIMO} caracteres).`;
    } else if (tamanho > DESCRICAO_TAMANHO_MAXIMO) {
      erros.descricao = `As observações devem ter no máximo ${DESCRICAO_TAMANHO_MAXIMO} caracteres.`;
    }
  }

  return erros;
}
