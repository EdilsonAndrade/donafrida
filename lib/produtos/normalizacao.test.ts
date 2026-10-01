import { describe, expect, it } from "vitest";
import { normalizarTextosProduto } from "./normalizacao";

describe("normalizarTextosProduto", () => {
  it("apara espaço nas pontas da categoria", () => {
    expect(normalizarTextosProduto({ categoria: "Perfume Feminino " }).categoria).toBe(
      "Perfume Feminino"
    );
  });

  it("apara espaço nas pontas do nome", () => {
    expect(normalizarTextosProduto({ nome: "  Perfume 478  " }).nome).toBe("Perfume 478");
  });

  it("preserva o espaço interno", () => {
    expect(normalizarTextosProduto({ categoria: " Perfume  Feminino " }).categoria).toBe(
      "Perfume  Feminino"
    );
  });

  it("mantém ausente o campo que não veio, para o PATCH não apagar nada", () => {
    const resultado = normalizarTextosProduto({ preco: 1990 });
    expect("categoria" in resultado).toBe(false);
    expect("nome" in resultado).toBe(false);
  });

  it("não altera campos que não são de texto", () => {
    expect(normalizarTextosProduto({ preco: 1990, estoque: 4 })).toEqual({
      preco: 1990,
      estoque: 4,
    });
  });

  it("ignora valor que não é string", () => {
    const resultado = normalizarTextosProduto({ categoria: 42 });
    expect(resultado.categoria).toBe(42);
  });

  it("não modifica o payload recebido", () => {
    const original = { categoria: "Bijuteria " };
    normalizarTextosProduto(original);
    expect(original.categoria).toBe("Bijuteria ");
  });
});
