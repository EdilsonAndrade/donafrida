import { describe, expect, it } from "vitest";
import { dividirCategorias, LIMITE_CATEGORIAS_BARRA } from "./navegacao";

describe("dividirCategorias", () => {
  it("devolve listas vazias quando não há categoria", () => {
    expect(dividirCategorias([])).toEqual({ naBarra: [], noMais: [] });
  });

  it("mantém tudo na barra quando há menos categorias que o limite", () => {
    expect(dividirCategorias(["Perfumes", "Bijuterias"], 5)).toEqual({
      naBarra: ["Perfumes", "Bijuterias"],
      noMais: [],
    });
  });

  it("mantém tudo na barra quando o total é exatamente o limite", () => {
    const categorias = ["a", "b", "c", "d", "e"];
    expect(dividirCategorias(categorias, 5)).toEqual({ naBarra: categorias, noMais: [] });
  });

  it("manda o excedente para o menu Mais, preservando a ordem", () => {
    expect(dividirCategorias(["a", "b", "c", "d", "e", "f", "g"], 5)).toEqual({
      naBarra: ["a", "b", "c", "d", "e"],
      noMais: ["f", "g"],
    });
  });

  it("manda tudo para o menu Mais quando o limite é zero", () => {
    expect(dividirCategorias(["a", "b"], 0)).toEqual({ naBarra: [], noMais: ["a", "b"] });
  });

  it("trata limite negativo como zero, sem quebrar o fatiamento", () => {
    expect(dividirCategorias(["a", "b"], -3)).toEqual({ naBarra: [], noMais: ["a", "b"] });
  });

  it("usa cinco como limite padrão", () => {
    expect(LIMITE_CATEGORIAS_BARRA).toBe(5);
    expect(dividirCategorias(["a", "b", "c", "d", "e", "f"]).naBarra).toHaveLength(5);
  });
});
