import { describe, expect, it } from "vitest";
import { linhasFichaTecnica } from "./fichaTecnicaExibicao";

describe("linhasFichaTecnica", () => {
  it("sem ficha, nenhuma linha", () => {
    expect(linhasFichaTecnica(undefined)).toEqual([]);
    expect(linhasFichaTecnica({})).toEqual([]);
  });

  it("perfume: só os campos preenchidos, com unidade e rótulos legíveis", () => {
    expect(
      linhasFichaTecnica({ marca: "Brand Collection", volumeMl: 25, genero: "feminino", inspiradoEm: "Good Girl" })
    ).toEqual([
      { rotulo: "marca", valor: "Brand Collection" },
      { rotulo: "volume", valor: "25 ml" },
      { rotulo: "gênero", valor: "Feminino" },
      { rotulo: "inspirado em", valor: "Good Girl" },
    ]);
  });

  it("bijuteria: banho com acento e itens inclusos juntos", () => {
    expect(linhasFichaTecnica({ banho: "rodio", itensInclusos: ["1 colar", "1 saquinho"] })).toEqual([
      { rotulo: "banho", valor: "Ródio" },
      { rotulo: "acompanha", valor: "1 colar, 1 saquinho" },
    ]);
  });
});
