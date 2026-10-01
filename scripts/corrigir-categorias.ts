/**
 * Apara espaço nas pontas de `nome` e `categoria` dos produtos já gravados
 * (EDI-124). Produtos salvos antes da correção da rota ficavam invisíveis no
 * catálogo: a categoria `"Perfume Feminino "` não casa com o segmento da URL
 * `/produtos/Perfume%20Feminino`.
 *
 * Não sobe servidor — escreve direto no MongoDB configurado em .env.local.
 *
 *   npm run corrigir:categorias            # mostra o que mudaria, sem gravar
 *   npm run corrigir:categorias -- --aplicar
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import getMongoClient, { DB_NAME } from "../lib/db/mongodb";
import { PRODUTOS_COLLECTION, type Produto } from "../lib/models/produto";

async function main() {
  const aplicar = process.argv.includes("--aplicar");

  const client = await getMongoClient();
  const colecao = client.db(DB_NAME).collection<Produto>(PRODUTOS_COLLECTION);
  const produtos = await colecao.find({}).toArray();

  const sujos = produtos.filter(
    (p) => p.nome !== p.nome?.trim() || p.categoria !== p.categoria?.trim()
  );

  if (sujos.length === 0) {
    console.log(`Nenhum produto com espaço nas pontas (${produtos.length} verificados).`);
    await client.close();
    return;
  }

  console.log(`${sujos.length} de ${produtos.length} produtos precisam de correção:\n`);

  for (const produto of sujos) {
    const nome = produto.nome?.trim() ?? produto.nome;
    const categoria = produto.categoria?.trim() ?? produto.categoria;

    console.log(`  ${produto._id}`);
    if (nome !== produto.nome) console.log(`    nome:      "${produto.nome}" → "${nome}"`);
    if (categoria !== produto.categoria) {
      console.log(`    categoria: "${produto.categoria}" → "${categoria}"`);
    }

    if (aplicar) {
      await colecao.updateOne({ _id: produto._id }, { $set: { nome, categoria } });
    }
  }

  console.log(
    aplicar
      ? `\n${sujos.length} produto(s) corrigido(s).`
      : "\nNada foi gravado. Rode de novo com --aplicar para corrigir."
  );

  await client.close();
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
