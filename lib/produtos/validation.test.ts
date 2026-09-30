import { describe, expect, it } from "vitest";
import { validarProduto } from "./validation";

const payloadValido = {
  nome: "Vaso Voronoi",
  descricao: "Vaso decorativo impresso em 3D.",
  preco: 4990,
  estoque: 10,
  categoria: "decoracao",
  fotos: ["https://blob.example/vaso.jpg"],
};

describe("validarProduto", () => {
  it("aceita um payload completo e válido", () => {
    expect(validarProduto(payloadValido)).toEqual({});
  });

  it("rejeita preço zero ou negativo", () => {
    expect(validarProduto({ ...payloadValido, preco: 0 })).toHaveProperty("preco");
    expect(validarProduto({ ...payloadValido, preco: -100 })).toHaveProperty("preco");
  });

  it("rejeita estoque negativo", () => {
    expect(validarProduto({ ...payloadValido, estoque: -1 })).toHaveProperty("estoque");
  });

  it("rejeita campo obrigatório ausente", () => {
    const { nome, ...semNome } = payloadValido;
    void nome;
    expect(validarProduto(semNome)).toHaveProperty("nome");
  });

  it("rejeita fotos vazio", () => {
    expect(validarProduto({ ...payloadValido, fotos: [] })).toHaveProperty("fotos");
  });

  it("no modo parcial, ignora campos ausentes e valida só os presentes", () => {
    expect(validarProduto({ preco: 100 }, { parcial: true })).toEqual({});
    expect(validarProduto({ preco: -1 }, { parcial: true })).toHaveProperty("preco");
  });

  const custoProdutoValido = {
    custoCompraCentavos: 3200,
    custoEmbalagemCentavos: 350,
    itensAdicionais: [
      { nome: "Sacola de presente", valorCentavos: 250 },
      { nome: "Amostra brinde", valorCentavos: 100 },
    ],
  };

  it("aceita produto sem custoProduto (campo opcional)", () => {
    expect(validarProduto(payloadValido)).toEqual({});
  });

  it("aceita custoProduto completo e válido", () => {
    expect(validarProduto({ ...payloadValido, custoProduto: custoProdutoValido })).toEqual({});
  });

  it("aceita custos zerados e lista de itens vazia", () => {
    expect(
      validarProduto({
        ...payloadValido,
        custoProduto: { custoCompraCentavos: 0, custoEmbalagemCentavos: 0, itensAdicionais: [] },
      })
    ).toEqual({});
  });

  it("rejeita compra ou embalagem ausente, negativa ou fracionada", () => {
    const { custoCompraCentavos, ...semCompra } = custoProdutoValido;
    void custoCompraCentavos;
    for (const custoProduto of [
      semCompra,
      { ...custoProdutoValido, custoCompraCentavos: -1 },
      { ...custoProdutoValido, custoEmbalagemCentavos: 10.5 },
    ]) {
      expect(validarProduto({ ...payloadValido, custoProduto })).toHaveProperty("custoProduto");
    }
  });

  it("rejeita item adicional sem nome, com nome longo ou valor negativo", () => {
    for (const item of [
      { nome: "  ", valorCentavos: 100 },
      { nome: "x".repeat(61), valorCentavos: 100 },
      { nome: "Laço", valorCentavos: -1 },
    ]) {
      expect(
        validarProduto({ ...payloadValido, custoProduto: { ...custoProdutoValido, itensAdicionais: [item] } })
      ).toHaveProperty("custoProduto");
    }
  });

  it("rejeita mais de 10 itens adicionais", () => {
    const itensAdicionais = Array.from({ length: 11 }, (_, i) => ({ nome: `Item ${i}`, valorCentavos: 10 }));
    expect(
      validarProduto({ ...payloadValido, custoProduto: { ...custoProdutoValido, itensAdicionais } })
    ).toHaveProperty("custoProduto");
  });

  it("rejeita custoProduto em formato inválido", () => {
    expect(validarProduto({ ...payloadValido, custoProduto: "não é objeto" })).toHaveProperty("custoProduto");
  });

  const embalagemEnvioValida = {
    pesoGramas: 250,
    alturaCm: 10,
    larguraCm: 15,
    comprimentoCm: 20,
  };

  it("aceita produto sem embalagemEnvio (campo opcional)", () => {
    expect(validarProduto(payloadValido)).toEqual({});
  });

  it("aceita embalagemEnvio completo e válido", () => {
    expect(validarProduto({ ...payloadValido, embalagemEnvio: embalagemEnvioValida })).toEqual({});
  });

  it("rejeita embalagemEnvio com campo obrigatório ausente", () => {
    const { pesoGramas, ...semPeso } = embalagemEnvioValida;
    void pesoGramas;
    expect(validarProduto({ ...payloadValido, embalagemEnvio: semPeso })).toHaveProperty(
      "embalagemEnvio"
    );
  });

  it("rejeita embalagemEnvio com campo zero ou negativo", () => {
    expect(
      validarProduto({ ...payloadValido, embalagemEnvio: { ...embalagemEnvioValida, pesoGramas: 0 } })
    ).toHaveProperty("embalagemEnvio");
    expect(
      validarProduto({
        ...payloadValido,
        embalagemEnvio: { ...embalagemEnvioValida, alturaCm: -1 },
      })
    ).toHaveProperty("embalagemEnvio");
  });

  it("rejeita embalagemEnvio em formato inválido", () => {
    expect(validarProduto({ ...payloadValido, embalagemEnvio: "não é objeto" })).toHaveProperty(
      "embalagemEnvio"
    );
  });

  it("aceita produto sem fichaTecnica (campo opcional)", () => {
    expect(validarProduto(payloadValido)).toEqual({});
  });

  it("aceita fichaTecnica vazia ({})", () => {
    expect(validarProduto({ ...payloadValido, fichaTecnica: {} })).toEqual({});
  });

  it("aceita fichaTecnica preenchida parcialmente (só marca)", () => {
    expect(validarProduto({ ...payloadValido, fichaTecnica: { marca: "Brand Collection" } })).toEqual({});
  });

  it("aceita fichaTecnica de perfume e de bijuteria com todos os campos válidos", () => {
    expect(
      validarProduto({
        ...payloadValido,
        fichaTecnica: {
          marca: "Brand Collection",
          modelo: "Nº 126",
          volumeMl: 25,
          genero: "feminino",
          familiaOlfativa: "Floral frutado",
          inspiradoEm: "Good Girl",
          itensInclusos: ["1 frasco 25 ml"],
        },
      })
    ).toEqual({});
    expect(
      validarProduto({
        ...payloadValido,
        fichaTecnica: { material: "Aço inoxidável", banho: "ouro", tamanho: "Aro 16", genero: "unissex" },
      })
    ).toEqual({});
  });

  it("rejeita volume não inteiro, zero ou acima de 5000 ml", () => {
    for (const volumeMl of [0, 25.5, 5001, "25"]) {
      expect(validarProduto({ ...payloadValido, fichaTecnica: { volumeMl } })).toHaveProperty("fichaTecnica");
    }
  });

  it("rejeita gênero e banho fora da lista", () => {
    expect(validarProduto({ ...payloadValido, fichaTecnica: { genero: "infantil" } })).toHaveProperty(
      "fichaTecnica"
    );
    expect(validarProduto({ ...payloadValido, fichaTecnica: { banho: "bronze" } })).toHaveProperty(
      "fichaTecnica"
    );
  });

  it("rejeita texto vazio ou longo demais quando presente", () => {
    expect(validarProduto({ ...payloadValido, fichaTecnica: { material: "" } })).toHaveProperty("fichaTecnica");
    expect(validarProduto({ ...payloadValido, fichaTecnica: { marca: "x".repeat(61) } })).toHaveProperty(
      "fichaTecnica"
    );
  });

  it("rejeita itensInclusos com item vazio quando presente", () => {
    expect(
      validarProduto({ ...payloadValido, fichaTecnica: { itensInclusos: ["1 frasco", ""] } })
    ).toHaveProperty("fichaTecnica");
  });

  it("rejeita fichaTecnica em formato inválido", () => {
    expect(validarProduto({ ...payloadValido, fichaTecnica: "não é objeto" })).toHaveProperty(
      "fichaTecnica"
    );
  });

  describe("taxas dos canais (EDI-106)", () => {
    it("aceita taxasCanais vazio e parcial", () => {
      expect(validarProduto({ ...payloadValido, taxasCanais: {} })).toEqual({});
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { shopeeTaxaPercentual: 20 } })
      ).toEqual({});
    });

    it("rejeita taxasCanais com percentual fora do intervalo ou taxa fixa negativa", () => {
      expect(validarProduto({ ...payloadValido, taxasCanais: { shopeeTaxaPercentual: 100 } })).toHaveProperty("taxasCanais");
      expect(validarProduto({ ...payloadValido, taxasCanais: { siteTaxaPercentual: -1 } })).toHaveProperty("taxasCanais");
      expect(validarProduto({ ...payloadValido, taxasCanais: { siteTaxaFixaCentavos: -5 } })).toHaveProperty("taxasCanais");
      expect(validarProduto({ ...payloadValido, taxasCanais: "x" })).toHaveProperty("taxasCanais");
    });

    it("aceita override de margemMinimaPercentual em taxasCanais, sem teto de 100, e rejeita negativo", () => {
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemMinimaPercentual: 25 } })
      ).toEqual({});
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemMinimaPercentual: 100 } })
      ).toEqual({});
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemMinimaPercentual: -1 } })
      ).toHaveProperty("taxasCanais");
    });

    it("aceita override de margemDesejadaPercentual em taxasCanais, sem teto de 100, e rejeita negativo", () => {
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemDesejadaPercentual: 40 } })
      ).toEqual({});
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemDesejadaPercentual: 300 } })
      ).toEqual({});
      expect(
        validarProduto({ ...payloadValido, taxasCanais: { margemDesejadaPercentual: -1 } })
      ).toHaveProperty("taxasCanais");
    });

    it("aceita precosCanais vazio e parcial", () => {
      expect(validarProduto({ ...payloadValido, precosCanais: {} })).toEqual({});
      expect(
        validarProduto({ ...payloadValido, precosCanais: { mercadoLivre: 5490 } })
      ).toEqual({});
    });

    it("rejeita precosCanais com valor zero, negativo, não inteiro ou formato inválido", () => {
      expect(validarProduto({ ...payloadValido, precosCanais: { mercadoLivre: 0 } })).toHaveProperty("precosCanais");
      expect(validarProduto({ ...payloadValido, precosCanais: { shopee: -100 } })).toHaveProperty("precosCanais");
      expect(validarProduto({ ...payloadValido, precosCanais: { mercadoLivre: 10.5 } })).toHaveProperty("precosCanais");
      expect(validarProduto({ ...payloadValido, precosCanais: "x" })).toHaveProperty("precosCanais");
    });
  });

  describe("publicação no catálogo da Meta (EDI-109)", () => {
    it("aceita metaCatalogo com e sem textos próprios", () => {
      expect(validarProduto({ ...payloadValido, metaCatalogo: { publicar: true } })).toEqual({});
      expect(
        validarProduto({
          ...payloadValido,
          metaCatalogo: { publicar: false, titulo: "Chaveiro 🔥", descricao: "A partir de R$ 39,90" },
        })
      ).toEqual({});
    });

    it("exige publicar booleano e formato de objeto", () => {
      expect(validarProduto({ ...payloadValido, metaCatalogo: {} })).toHaveProperty("metaCatalogo");
      expect(validarProduto({ ...payloadValido, metaCatalogo: { publicar: "sim" } })).toHaveProperty("metaCatalogo");
      expect(validarProduto({ ...payloadValido, metaCatalogo: [] })).toHaveProperty("metaCatalogo");
    });

    it("rejeita título acima de 200 e descrição acima de 9999 caracteres", () => {
      expect(
        validarProduto({ ...payloadValido, metaCatalogo: { publicar: true, titulo: "a".repeat(201) } })
      ).toHaveProperty("metaCatalogo");
      expect(
        validarProduto({ ...payloadValido, metaCatalogo: { publicar: true, titulo: "a".repeat(200) } })
      ).toEqual({});
      expect(
        validarProduto({ ...payloadValido, metaCatalogo: { publicar: true, descricao: "a".repeat(10000) } })
      ).toHaveProperty("metaCatalogo");
    });
  });
});
