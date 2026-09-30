import { describe, expect, it } from "vitest";
import { quantidadeDeEntrada, validarEncomenda } from "./validacao";

const PRODUTO_ID = "66f1a2b3c4d5e6f708192a3b";

const payloadValido = {
  produtoId: PRODUTO_ID,
  quantidade: 30,
  nome: "Maria",
  email: "maria@exemplo.com",
  telefone: "(19) 99999-8888",
};

describe("validarEncomenda", () => {
  it("não retorna erros para um payload válido com produto e sem observações", () => {
    expect(validarEncomenda(payloadValido)).toEqual({});
  });

  it("aceita encomenda sem produto quando as observações descrevem o pedido", () => {
    expect(
      validarEncomenda({ ...payloadValido, produtoId: "", descricao: "50 perfumes femininos variados, 25 ml." })
    ).toEqual({});
  });

  it("sem produto, exige observações com tamanho mínimo", () => {
    expect(validarEncomenda({ ...payloadValido, produtoId: undefined }).descricao).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, produtoId: "", descricao: "curto" }).descricao).toBeDefined();
  });

  it("com produto, aceita observação curta, mas limita o tamanho máximo", () => {
    expect(validarEncomenda({ ...payloadValido, descricao: "até dia 20" }).descricao).toBeUndefined();
    expect(validarEncomenda({ ...payloadValido, descricao: "a".repeat(2001) }).descricao).toBeDefined();
  });

  it("rejeita produtoId em formato inválido", () => {
    expect(validarEncomenda({ ...payloadValido, produtoId: "abc" }).produtoId).toBeDefined();
  });

  it("exige quantidade inteira entre 1 e 10.000", () => {
    for (const quantidade of [undefined, 0, -1, 2.5, 10001, "dez", ""]) {
      expect(validarEncomenda({ ...payloadValido, quantidade }).quantidade).toBeDefined();
    }
    expect(validarEncomenda({ ...payloadValido, quantidade: "30" }).quantidade).toBeUndefined();
    expect(validarEncomenda({ ...payloadValido, quantidade: 10000 }).quantidade).toBeUndefined();
  });

  it("exige nome", () => {
    expect(validarEncomenda({ ...payloadValido, nome: undefined }).nome).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, nome: "  " }).nome).toBeDefined();
  });

  it("exige e-mail em formato válido", () => {
    expect(validarEncomenda({ ...payloadValido, email: "invalido" }).email).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, email: undefined }).email).toBeDefined();
  });

  it("exige telefone obrigatório com DDD", () => {
    expect(validarEncomenda({ ...payloadValido, telefone: undefined }).telefone).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, telefone: "" }).telefone).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, telefone: "123" }).telefone).toBeDefined();
    expect(validarEncomenda({ ...payloadValido, telefone: "19999998888" }).telefone).toBeUndefined();
  });

  it("rejeita valores que não são texto/número", () => {
    expect(validarEncomenda({ quantidade: null, nome: 1, email: {}, telefone: [], descricao: null })).toEqual({
      quantidade: expect.any(String),
      nome: expect.any(String),
      email: expect.any(String),
      telefone: expect.any(String),
      descricao: expect.any(String),
    });
  });
});

describe("quantidadeDeEntrada", () => {
  it("aceita número ou texto só com dígitos", () => {
    expect(quantidadeDeEntrada(30)).toBe(30);
    expect(quantidadeDeEntrada(" 30 ")).toBe(30);
  });

  it("texto com outros caracteres vira NaN", () => {
    expect(quantidadeDeEntrada("3,5")).toBeNaN();
    expect(quantidadeDeEntrada("trinta")).toBeNaN();
    expect(quantidadeDeEntrada(undefined)).toBeNaN();
  });
});
