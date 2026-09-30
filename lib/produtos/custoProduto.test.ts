import { describe, expect, it } from "vitest";
import { calcularCustoProduto } from "./custoProduto";

describe("calcularCustoProduto", () => {
  it("soma compra, embalagem e itens adicionais (exemplo da spec: R$ 39,00)", () => {
    const resultado = calcularCustoProduto({
      custoCompraCentavos: 3200,
      custoEmbalagemCentavos: 350,
      itensAdicionais: [
        { nome: "Sacola de presente", valorCentavos: 250 },
        { nome: "Amostra brinde", valorCentavos: 100 },
      ],
    });

    expect(resultado.totalItensAdicionaisCentavos).toBe(350);
    expect(resultado.totalCentavos).toBe(3900);
  });

  it("sem itens adicionais, o total é compra + embalagem", () => {
    const resultado = calcularCustoProduto({
      custoCompraCentavos: 1000,
      custoEmbalagemCentavos: 200,
      itensAdicionais: [],
    });

    expect(resultado).toMatchObject({ totalItensAdicionaisCentavos: 0, totalCentavos: 1200 });
  });

  it("itens com o mesmo nome são somados separadamente", () => {
    const resultado = calcularCustoProduto({
      custoCompraCentavos: 0,
      custoEmbalagemCentavos: 0,
      itensAdicionais: [
        { nome: "Laço", valorCentavos: 50 },
        { nome: "Laço", valorCentavos: 50 },
      ],
    });

    expect(resultado.totalCentavos).toBe(100);
  });

  it("arredonda cada componente antes de somar (total bate com o detalhamento)", () => {
    const resultado = calcularCustoProduto({
      custoCompraCentavos: 100.4,
      custoEmbalagemCentavos: 100.4,
      itensAdicionais: [{ nome: "Fita", valorCentavos: 100.4 }],
    });

    expect(resultado.totalCentavos).toBe(
      resultado.custoCompraCentavos + resultado.custoEmbalagemCentavos + resultado.totalItensAdicionaisCentavos
    );
    expect(resultado.totalCentavos).toBe(300);
  });
});
