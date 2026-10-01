/**
 * Campos de texto livre que compõem URL, slug ou chave de unicidade e que,
 * por isso, não podem carregar espaço nas pontas (EDI-124).
 *
 * O caso que motivou: um produto salvo com a categoria `"Perfume Feminino "`
 * ficava invisível em `/produtos/Perfume%20Feminino`, porque o segmento da URL
 * não casava com o valor gravado.
 */
const CAMPOS_TEXTO = ["nome", "categoria"] as const;

/**
 * Devolve uma cópia do payload com os campos de texto aparados. Campos
 * ausentes continuam ausentes — importante no PATCH, onde a ausência significa
 * "não mexer" e um valor vazio significaria apagar.
 */
export function normalizarTextosProduto<T extends object>(payload: T): T {
  const normalizado = { ...payload } as T &
    Partial<Record<(typeof CAMPOS_TEXTO)[number], unknown>>;

  for (const campo of CAMPOS_TEXTO) {
    const valor = normalizado[campo];
    if (typeof valor === "string") {
      normalizado[campo] = valor.trim();
    }
  }

  return normalizado;
}
