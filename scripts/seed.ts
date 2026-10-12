/**
 * Popula o catálogo com perfumes de demonstração para
 * visualização do site. Não sobe nenhum servidor — só insere documentos
 * direto no MongoDB Atlas já configurado em .env.local. Rode com `npm run seed`.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import getMongoClient, { DB_NAME } from "../lib/db/mongodb";
import { PRODUTOS_COLLECTION, type Produto } from "../lib/models/produto";
import { gerarSlug } from "../lib/produtos/slug";

/** Foto provisória em SVG (frasco) na paleta da marca — sem depender de arquivo externo. */
function fotoMock(cor: string, forma: "frasco"): string {
  const formas: Record<typeof forma, string> = {
    frasco:
      `<rect x="85" y="30" width="30" height="22" rx="4" fill="#6f6667"/>` +
      `<rect x="55" y="52" width="90" height="118" rx="22" fill="${cor}"/>` +
      `<rect x="70" y="95" width="60" height="34" rx="6" fill="#ffffffaa"/>`,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#F7E9EA"/>${formas[forma]}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PRODUTOS_MOCK: Array<Omit<Produto, "_id" | "slug" | "criadoEm" | "atualizadoEm">> = [
  {
    nome: "Perfume Feminino Brand Collection Nº 126 — 25 ml",
    descricao: "Fragrância floral adocicada, marcante e elegante. Frasco de bolso, ideal para levar na bolsa.",
    preco: 5999,
    fotos: [fotoMock("#D9B8BC", "frasco")],
    estoque: 12,
    categoria: "perfumes-femininos",
    custoProduto: { custoCompraCentavos: 3200, custoEmbalagemCentavos: 350, itensAdicionais: [] },
    fichaTecnica: {
      marca: "Brand Collection",
      modelo: "Nº 126",
      volumeMl: 25,
      genero: "feminino",
      familiaOlfativa: "Floral oriental",
      inspiradoEm: "Good Girl",
    },
  },
  {
    nome: "Perfume Masculino Brand Collection Nº 329 — 25 ml",
    descricao: "Amadeirado aromático, fresco e duradouro para o dia a dia.",
    preco: 6999,
    fotos: [fotoMock("#B7A6A3", "frasco")],
    estoque: 8,
    categoria: "perfumes-masculinos",
    custoProduto: {
      custoCompraCentavos: 3800,
      custoEmbalagemCentavos: 350,
      itensAdicionais: [{ nome: "Amostra brinde", valorCentavos: 100 }],
    },
    fichaTecnica: { marca: "Brand Collection", modelo: "Nº 329", volumeMl: 25, genero: "masculino" },
  },
  {
    nome: "Body Splash Rosy Glow — 200 ml",
    descricao: "Névoa corporal perfumada com notas frutadas e florais. Leve e refrescante.",
    preco: 7499,
    fotos: [fotoMock("#F2C9CF", "frasco")],
    estoque: 0,
    categoria: "body-splash",
    fichaTecnica: { volumeMl: 200, genero: "feminino", familiaOlfativa: "Frutado" },
  },
];

async function main() {
  const client = await getMongoClient();
  const colecao = client.db(DB_NAME).collection<Produto>(PRODUTOS_COLLECTION);

  for (const dados of PRODUTOS_MOCK) {
    const slug = gerarSlug(dados.nome);
    const existente = await colecao.findOne({ categoria: dados.categoria, slug });
    if (existente) {
      console.log(`- já existe, pulando: ${dados.nome}`);
      continue;
    }
    const agora = new Date();
    await colecao.insertOne({ ...dados, slug, criadoEm: agora, atualizadoEm: agora });
    console.log(`+ inserido: ${dados.nome}`);
  }

  console.log("Seed concluído.");
  process.exit(0);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
