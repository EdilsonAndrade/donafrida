import { Manrope } from "next/font/google";

/**
 * Fonte única da loja. Servida pelo próprio domínio (next/font), sem requisição
 * ao Google em tempo de execução. Exposta como `--font-manrope`, que alimenta
 * `--font-display` e `--font-body` em globals.css.
 */
export const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});
