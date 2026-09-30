/** Categorias divididas entre a barra do cabeçalho e o menu "Mais" (EDI-116, FR-009). */
export interface CategoriasNavegacao {
  /** Categorias exibidas em linha no cabeçalho. */
  naBarra: string[];
  /** Excedente, exibido dentro do menu "Mais". Vazio quando tudo coube na barra. */
  noMais: string[];
}

/** Quantas categorias cabem ao lado da marca, da busca e dos ícones em 1180px. */
export const LIMITE_CATEGORIAS_BARRA = 5;

/**
 * Divide as categorias entre a barra e o menu "Mais".
 *
 * Com `limite` ou menos categorias, tudo fica na barra e "Mais" não é
 * renderizado. Acima disso, a barra recebe exatamente `limite` e o restante vai
 * para o menu, preservando a ordem recebida.
 */
export function dividirCategorias(
  categorias: string[],
  limite: number = LIMITE_CATEGORIAS_BARRA
): CategoriasNavegacao {
  const maximo = Math.max(0, limite);

  if (categorias.length <= maximo) {
    return { naBarra: categorias, noMais: [] };
  }

  return { naBarra: categorias.slice(0, maximo), noMais: categorias.slice(maximo) };
}
