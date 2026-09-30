import { ROTULOS_BANHO, ROTULOS_GENERO, type FichaTecnicaProduto } from "@/lib/models/produto";

/**
 * Linhas "rótulo: valor" da ficha técnica para a página do produto — só os
 * campos preenchidos, na ordem em que o comprador procura (marca e volume
 * primeiro).
 */
export function linhasFichaTecnica(ficha?: FichaTecnicaProduto): Array<{ rotulo: string; valor: string }> {
  if (!ficha) return [];

  const linhas: Array<[string, string | undefined]> = [
    ["marca", ficha.marca],
    ["modelo", ficha.modelo],
    ["volume", ficha.volumeMl ? `${ficha.volumeMl} ml` : undefined],
    ["gênero", ficha.genero ? ROTULOS_GENERO[ficha.genero] : undefined],
    ["família olfativa", ficha.familiaOlfativa],
    ["inspirado em", ficha.inspiradoEm],
    ["material", ficha.material],
    ["banho", ficha.banho ? ROTULOS_BANHO[ficha.banho] : undefined],
    ["tamanho", ficha.tamanho],
    ["acompanha", ficha.itensInclusos?.join(", ")],
  ];

  return linhas
    .filter((linha): linha is [string, string] => Boolean(linha[1]))
    .map(([rotulo, valor]) => ({ rotulo, valor }));
}
