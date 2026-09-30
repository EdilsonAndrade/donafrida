import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import type { Produto } from "@/lib/models/produto";
import { formatarPrecoMeta, gerarCsvFeedMeta, montarItemFeedMeta } from "./feedMeta";

const BASE = "https://www.donafrida.com.br";
const ID = new ObjectId("66f1a2b3c4d5e6f708192a3b");

function produto(parcial: Partial<Produto> = {}): Produto {
  return {
    _id: ID,
    nome: "Perfume Nº 126",
    slug: "perfume-126",
    descricao: "Perfume feminino 25 ml.",
    preco: 3990,
    fotos: ["https://blob.example/a.jpg", "https://blob.example/b.jpg"],
    estoque: 5,
    categoria: "perfumes",
    metaCatalogo: { publicar: true },
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    ...parcial,
  };
}

describe("formatarPrecoMeta", () => {
  it("converte centavos para o formato da Meta", () => {
    expect(formatarPrecoMeta(3990)).toBe("39.90 BRL");
    expect(formatarPrecoMeta(4000)).toBe("40.00 BRL");
    expect(formatarPrecoMeta(5)).toBe("0.05 BRL");
  });
});

describe("montarItemFeedMeta", () => {
  it("monta todas as colunas a partir do produto", () => {
    expect(montarItemFeedMeta(produto(), BASE)).toEqual({
      id: "66f1a2b3c4d5e6f708192a3b",
      title: "Perfume Nº 126",
      description: "Perfume feminino 25 ml.",
      availability: "in stock",
      condition: "new",
      price: "39.90 BRL",
      link: "https://www.donafrida.com.br/produtos/perfumes/perfume-126",
      image_link: "https://blob.example/a.jpg",
      additional_image_link: "https://blob.example/b.jpg",
      brand: "Dona Frida",
      product_type: "perfumes",
      gender: "",
    });
  });

  it("usa a marca e o gênero da ficha técnica quando preenchidos", () => {
    const item = montarItemFeedMeta(
      produto({ fichaTecnica: { marca: "Brand Collection", genero: "unissex" } }),
      BASE
    );
    expect(item?.brand).toBe("Brand Collection");
    expect(item?.gender).toBe("unisex");
  });

  it("usa os textos próprios do Facebook quando preenchidos", () => {
    const item = montarItemFeedMeta(
      produto({ metaCatalogo: { publicar: true, titulo: " Perfume 🔥 ", descricao: "A partir de R$ 39,90" } }),
      BASE
    );
    expect(item?.title).toBe("Perfume 🔥");
    expect(item?.description).toBe("A partir de R$ 39,90");
  });

  it("textos próprios em branco voltam para os do site; descrição vazia usa o nome", () => {
    const item = montarItemFeedMeta(
      produto({ descricao: "  ", metaCatalogo: { publicar: true, titulo: "  ", descricao: "" } }),
      BASE
    );
    expect(item?.title).toBe("Perfume Nº 126");
    expect(item?.description).toBe("Perfume Nº 126");
  });

  it("estoque zerado vira fora de estoque, sem remover o item", () => {
    expect(montarItemFeedMeta(produto({ estoque: 0 }), BASE)?.availability).toBe("out of stock");
  });

  it("ignora produtos não marcados ou sem foto", () => {
    expect(montarItemFeedMeta(produto({ metaCatalogo: undefined }), BASE)).toBeNull();
    expect(montarItemFeedMeta(produto({ metaCatalogo: { publicar: false } }), BASE)).toBeNull();
    expect(montarItemFeedMeta(produto({ fotos: [] }), BASE)).toBeNull();
  });

  it("gera links absolutos e codifica categoria/slug", () => {
    const item = montarItemFeedMeta(
      produto({ categoria: "bijuterias-ação", slug: "colar", fotos: ["/images/a.jpg"] }),
      BASE
    );
    expect(item?.link).toBe("https://www.donafrida.com.br/produtos/bijuterias-a%C3%A7%C3%A3o/colar");
    expect(item?.image_link).toBe("https://www.donafrida.com.br/images/a.jpg");
    expect(item?.additional_image_link).toBe("");
  });

  it("limita a 20 fotos adicionais", () => {
    const fotos = Array.from({ length: 25 }, (_, i) => `https://blob.example/${i}.jpg`);
    const item = montarItemFeedMeta(produto({ fotos }), BASE);
    expect(item?.additional_image_link.split(",")).toHaveLength(20);
  });

  it("trunca título do site acima de 200 caracteres sem partir emoji", () => {
    const item = montarItemFeedMeta(produto({ nome: `${"a".repeat(199)}🔥🔥` }), BASE);
    expect(Array.from(item!.title)).toHaveLength(200);
    expect(item!.title.endsWith("🔥")).toBe(true);
  });
});

describe("gerarCsvFeedMeta", () => {
  const CABECALHO =
    "id,title,description,availability,condition,price,link,image_link,additional_image_link,brand,product_type,gender";

  it("sem produtos marcados, retorna só o cabeçalho", () => {
    expect(gerarCsvFeedMeta([produto({ metaCatalogo: undefined })], BASE)).toBe(`${CABECALHO}\r\n`);
  });

  it("escapa vírgulas, aspas e quebras de linha", () => {
    const csv = gerarCsvFeedMeta(
      [produto({ descricao: 'Linha 1, "top"\nLinha 2', fotos: ["https://blob.example/a.jpg"] })],
      BASE
    );
    const [cabecalho, linha] = csv.split("\r\n");
    expect(cabecalho).toBe(CABECALHO);
    expect(linha).toBe(
      '66f1a2b3c4d5e6f708192a3b,Perfume Nº 126,"Linha 1, ""top""\nLinha 2",in stock,new,39.90 BRL,' +
        "https://www.donafrida.com.br/produtos/perfumes/perfume-126,https://blob.example/a.jpg,,Dona Frida,perfumes,"
    );
  });

  it("coloca várias fotos adicionais entre aspas", () => {
    const csv = gerarCsvFeedMeta(
      [produto({ fotos: ["https://x/a.jpg", "https://x/b.jpg", "https://x/c.jpg"] })],
      BASE
    );
    expect(csv).toContain('"https://x/b.jpg,https://x/c.jpg"');
  });
});
