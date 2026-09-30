import {
  BANHOS_BIJUTERIA,
  GENEROS_PRODUTO,
  type BanhoBijuteria,
  type FichaTecnicaProduto,
  type GeneroProduto,
} from "@/lib/models/produto";

/**
 * Valores do formulário de ficha técnica (perfume/bijuteria) — todos em
 * texto, convertidos ao salvar. Vive fora de `ProdutoForm.tsx` (que é
 * `"use client"`) pelo mesmo motivo de `embalagemEnvioFormulario.ts`: é usado
 * tanto pelo formulário (client) quanto pela página de edição (Server
 * Component).
 *
 * Cada campo é **individualmente** opcional — preencher só um deles não
 * invalida os demais.
 */
export interface FichaTecnicaFormValores {
  marca: string;
  modelo: string;
  volumeMl: string;
  /** "" = não informado. */
  genero: GeneroProduto | "";
  familiaOlfativa: string;
  inspiradoEm: string;
  material: string;
  /** "" = não informado. */
  banho: BanhoBijuteria | "";
  tamanho: string;
  /** Um item por linha — convertido para `string[]` ao salvar. */
  itensInclusos: string;
}

export const VAZIO_FICHA_TECNICA: FichaTecnicaFormValores = {
  marca: "",
  modelo: "",
  volumeMl: "",
  genero: "",
  familiaOlfativa: "",
  inspiradoEm: "",
  material: "",
  banho: "",
  tamanho: "",
  itensInclusos: "",
};

const CAMPOS_TEXTO = ["marca", "modelo", "familiaOlfativa", "inspiradoEm", "material", "tamanho"] as const;

function itensDeTexto(valor: string): string[] {
  return valor
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0);
}

/** `true` quando ao menos um campo do formulário tem algo preenchido. */
export function camposFichaTecnicaPreenchidos(form: FichaTecnicaFormValores): boolean {
  return Boolean(montarFichaTecnica(form));
}

/**
 * Converte o formulário para `FichaTecnicaProduto` — inclui só os campos
 * válidos preenchidos (volume inválido/vazio é apenas omitido, sem invalidar
 * os demais). Retorna `undefined` quando nada foi preenchido.
 */
export function montarFichaTecnica(form: FichaTecnicaFormValores): FichaTecnicaProduto | undefined {
  const ficha: FichaTecnicaProduto = {};

  for (const campo of CAMPOS_TEXTO) {
    const valor = form[campo].trim();
    if (valor !== "") ficha[campo] = valor;
  }

  const volumeTexto = form.volumeMl.trim();
  const volume = Number(volumeTexto.replace(",", "."));
  if (volumeTexto !== "" && Number.isInteger(volume) && volume > 0) {
    ficha.volumeMl = volume;
  }

  if (GENEROS_PRODUTO.includes(form.genero as GeneroProduto)) {
    ficha.genero = form.genero as GeneroProduto;
  }
  if (BANHOS_BIJUTERIA.includes(form.banho as BanhoBijuteria)) {
    ficha.banho = form.banho as BanhoBijuteria;
  }

  const itens = itensDeTexto(form.itensInclusos);
  if (itens.length > 0) {
    ficha.itensInclusos = itens;
  }

  return Object.keys(ficha).length > 0 ? ficha : undefined;
}

/** `FichaTecnicaProduto` salva → formulário em texto — usado ao editar um produto. */
export function fichaTecnicaParaFormulario(fichaTecnica?: FichaTecnicaProduto): FichaTecnicaFormValores {
  if (!fichaTecnica) return VAZIO_FICHA_TECNICA;

  return {
    marca: fichaTecnica.marca ?? "",
    modelo: fichaTecnica.modelo ?? "",
    volumeMl: fichaTecnica.volumeMl !== undefined ? String(fichaTecnica.volumeMl) : "",
    genero: fichaTecnica.genero ?? "",
    familiaOlfativa: fichaTecnica.familiaOlfativa ?? "",
    inspiradoEm: fichaTecnica.inspiradoEm ?? "",
    material: fichaTecnica.material ?? "",
    banho: fichaTecnica.banho ?? "",
    tamanho: fichaTecnica.tamanho ?? "",
    itensInclusos: fichaTecnica.itensInclusos?.join("\n") ?? "",
  };
}
