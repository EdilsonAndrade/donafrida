import { afterEach, describe, expect, it, vi } from "vitest";
import type { Produto } from "@/lib/models/produto";

vi.mock("./auth", () => ({
  obterAccessTokenValido: vi.fn().mockResolvedValue("token-valido"),
}));

const {
  buscarAtributosObrigatorios,
  buscarAtributosCategoria,
  valorPadraoAtributo,
  atributosEmbalagem,
  atributosFichaTecnica,
  atributosFixos,
} = await import("./atributos");

const produtoBase: Produto = {
  _id: undefined,
  nome: "Perfume Brand Collection Nº 126",
  slug: "perfume-brand-collection-126",
  descricao: "Perfume feminino 25 ml",
  preco: 1990,
  fotos: ["https://exemplo.com/foto.jpg"],
  estoque: 2,
  categoria: "perfumes-femininos",
  criadoEm: new Date(),
  atualizadoEm: new Date(),
};

describe("buscarAtributosObrigatorios", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("retorna só os atributos marcados como obrigatórios", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "BRAND", value_type: "list", tags: { required: true }, values: [] },
          { id: "COLOR", value_type: "list", tags: {}, values: [] },
        ],
      })
    );

    const atributos = await buscarAtributosObrigatorios("MLB12345");

    expect(atributos).toHaveLength(1);
    expect(atributos[0].id).toBe("BRAND");
  });

  it("lança erro quando a API responde com falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "" }));
    await expect(buscarAtributosObrigatorios("MLB12345")).rejects.toThrow("HTTP 500");
  });
});

describe("buscarAtributosCategoria", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("retorna todos os atributos da categoria, obrigatórios e opcionais (reaproveitado por atributosFichaTecnica)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "BRAND", value_type: "list", tags: { required: true }, values: [] },
          { id: "HEIGHT", value_type: "number_unit", tags: {} },
        ],
      })
    );

    const atributos = await buscarAtributosCategoria("MLB12345");

    expect(atributos).toHaveLength(2);
  });

  it("lança erro quando a API responde com falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "" }));
    await expect(buscarAtributosCategoria("MLB12345")).rejects.toThrow("HTTP 500");
  });
});

describe("valorPadraoAtributo", () => {
  it("lista com opção genérica: usa o value_id da opção genérica", () => {
    const valor = valorPadraoAtributo(
      {
        id: "BRAND",
        value_type: "list",
        values: [
          { id: "123", name: "Nike" },
          { id: "999", name: "Genérica" },
        ],
      },
      produtoBase
    );

    expect(valor).toEqual({ id: "BRAND", value_id: "999" });
  });

  it("lista sem opção genérica: usa a primeira opção da lista", () => {
    const valor = valorPadraoAtributo(
      { id: "BRAND", value_type: "list", values: [{ id: "123", name: "Nike" }] },
      produtoBase
    );

    expect(valor).toEqual({ id: "BRAND", value_id: "123" });
  });

  it("atributo booleano (ex: WITH_USB): usa a opção 'Não', não o nome do produto (correção: EDI-108)", () => {
    const valor = valorPadraoAtributo(
      {
        id: "WITH_USB",
        value_type: "boolean",
        values: [
          { id: "242084", name: "Não" },
          { id: "242085", name: "Sim" },
        ],
      },
      produtoBase
    );

    expect(valor).toEqual({ id: "WITH_USB", value_id: "242084" });
  });

  it("atributo booleano sem opção 'Não' reconhecível: usa a primeira opção", () => {
    const valor = valorPadraoAtributo(
      { id: "X", value_type: "boolean", values: [{ id: "1", name: "Talvez" }] },
      produtoBase
    );

    expect(valor).toEqual({ id: "X", value_id: "1" });
  });

  it("atributo de texto livre: usa o nome do produto", () => {
    const valor = valorPadraoAtributo({ id: "MODEL", value_type: "string" }, produtoBase);

    expect(valor).toEqual({ id: "MODEL", value_name: "Perfume Brand Collection Nº 126" });
  });

  it("BRAND de texto livre: usa a marca da ficha técnica quando preenchida", () => {
    const valor = valorPadraoAtributo(
      { id: "BRAND", value_type: "string" },
      { ...produtoBase, fichaTecnica: { marca: "Brand Collection" } }
    );

    expect(valor).toEqual({ id: "BRAND", value_name: "Brand Collection" });
  });

  it("BRAND de texto livre sem marca na ficha: usa 'Dona Frida', não o nome do produto", () => {
    const valor = valorPadraoAtributo({ id: "BRAND", value_type: "string" }, produtoBase);

    expect(valor).toEqual({ id: "BRAND", value_name: "Dona Frida" });
    expect(valor.value_name).not.toBe(produtoBase.nome);
  });

  it("BRAND e MODEL de texto livre nunca saem com o mesmo valor (EDI-95)", () => {
    const marca = valorPadraoAtributo({ id: "BRAND", value_type: "string" }, produtoBase);
    const modelo = valorPadraoAtributo({ id: "MODEL", value_type: "string" }, produtoBase);

    expect(marca.value_name).not.toBe(modelo.value_name);
  });
});

describe("atributosEmbalagem", () => {
  it("monta os 4 atributos com a unidade junto do valor — sem unidade o Mercado Livre descarta o atributo silenciosamente (EDI-96, confirmado em produção)", () => {
    const atributos = atributosEmbalagem({
      pesoGramas: 250,
      alturaCm: 10,
      larguraCm: 15,
      comprimentoCm: 20,
    });

    expect(atributos).toEqual([
      { id: "SELLER_PACKAGE_WEIGHT", value_name: "250 g" },
      { id: "SELLER_PACKAGE_HEIGHT", value_name: "10 cm" },
      { id: "SELLER_PACKAGE_WIDTH", value_name: "15 cm" },
      { id: "SELLER_PACKAGE_LENGTH", value_name: "20 cm" },
    ]);
  });
});

describe("atributosFichaTecnica", () => {
  const categoriaPerfume = [
    { id: "BRAND", value_type: "string", tags: {} },
    { id: "LINE", value_type: "string", tags: {} },
    { id: "UNIT_VOLUME", value_type: "number_unit", tags: {} },
    { id: "GENDER", value_type: "list", tags: {} },
  ];
  const categoriaBijuteria = [
    { id: "MATERIAL", value_type: "string", tags: {} },
    { id: "PLATING", value_type: "list", tags: {} },
  ];

  it("perfume: marca, modelo (LINE como fallback), volume com unidade e gênero viram atributos", () => {
    const resultado = atributosFichaTecnica(
      { marca: "Brand Collection", modelo: "Nº 126", volumeMl: 25, genero: "feminino" },
      categoriaPerfume
    );

    expect(resultado.attributes).toEqual([
      { id: "BRAND", value_name: "Brand Collection" },
      { id: "LINE", value_name: "Nº 126" },
      { id: "UNIT_VOLUME", value_name: "25 mL" },
      { id: "GENDER", value_name: "Feminino" },
    ]);
    expect(resultado.paraDescricao).toEqual([]);
  });

  it("unissex vira 'Sem gênero' no Mercado Livre", () => {
    const { attributes } = atributosFichaTecnica({ genero: "unissex" }, categoriaPerfume);
    expect(attributes).toEqual([{ id: "GENDER", value_name: "Sem gênero" }]);
  });

  it("bijuteria: material e banho viram atributos; tamanho sem atributo vai para a descrição", () => {
    const resultado = atributosFichaTecnica(
      { material: "Aço inoxidável", banho: "ouro", tamanho: "Aro 16" },
      categoriaBijuteria
    );

    expect(resultado.attributes).toEqual([
      { id: "MATERIAL", value_name: "Aço inoxidável" },
      { id: "PLATING", value_name: "Ouro" },
    ]);
    expect(resultado.paraDescricao).toEqual([{ rotulo: "Tamanho", valor: "Aro 16" }]);
  });

  it("'inspirado em' e itens inclusos sempre vão para a descrição", () => {
    const resultado = atributosFichaTecnica(
      { inspiradoEm: "Good Girl", itensInclusos: ["1 frasco", "1 caixa"] },
      categoriaPerfume
    );

    expect(resultado.attributes).toEqual([]);
    expect(resultado.paraDescricao).toEqual([
      { rotulo: "Inspirado em", valor: "Good Girl" },
      { rotulo: "Itens inclusos", valor: "1 frasco, 1 caixa" },
    ]);
  });

  it("ficha técnica vazia: nenhum atributo e nenhum texto para descrição", () => {
    expect(atributosFichaTecnica({}, categoriaPerfume)).toEqual({ attributes: [], paraDescricao: [] });
  });
});

describe("atributosFixos", () => {
  const categoriaComFabricante = [{ id: "MANUFACTURER", value_type: "string", tags: {} }];

  it("envia Fabricante com a marca da ficha técnica", () => {
    expect(atributosFixos(categoriaComFabricante, { marca: "Brand Collection" })).toEqual([
      { id: "MANUFACTURER", value_name: "Brand Collection" },
    ]);
  });

  it("sem marca na ficha não envia Fabricante (a loja revende, não fabrica)", () => {
    expect(atributosFixos(categoriaComFabricante)).toEqual([]);
    expect(atributosFixos(categoriaComFabricante, { volumeMl: 25 })).toEqual([]);
  });

  it("categoria sem MANUFACTURER: não envia nada", () => {
    expect(atributosFixos([], { marca: "Brand Collection" })).toEqual([]);
  });
});
