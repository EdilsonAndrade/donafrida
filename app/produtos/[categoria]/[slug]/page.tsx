import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { buscarProdutoPorCategoriaESlug } from "@/lib/produtos/repository";
import { decodificarSegmentoRota } from "@/lib/produtos/slug";
import { linhasFichaTecnica } from "@/lib/produtos/fichaTecnicaExibicao";
import { buscarAvaliacoesProduto } from "@/lib/avaliacoes/repository";
import BotaoAdicionarCarrinho from "@/components/carrinho/BotaoAdicionarCarrinho";
import AvaliacoesProduto from "@/components/produtos/AvaliacoesProduto";
import GaleriaFotosProduto from "@/components/produtos/GaleriaFotosProduto";
import Preco from "@/components/produtos/Preco";
import styles from "@/components/produtos/produtos.module.css";

// Sem `searchParams`/cookies/headers, essa página não tem nenhuma API que
// force renderização dinâmica por padrão — o Next.js a trata como estática e
// cacheia o resultado (incluindo `notFound()`), então um produto criado
// depois do primeiro acesso à URL (ou renomeado, mudando o slug) fica preso
// mostrando "não encontrado" até o próximo deploy. Catálogo pequeno, sem
// exigência de performance (specs/003-carrinho-checkout/plan.md) — forçar
// dinâmico garante que estoque/preço/existência do produto sempre refletem o
// banco na hora.
export const dynamic = "force-dynamic";

export default async function ProdutoDetalhePage({
  params,
}: {
  params: Promise<{ categoria: string; slug: string }>;
}) {
  const { categoria, slug } = await params;
  const produto = await buscarProdutoPorCategoriaESlug(decodificarSegmentoRota(categoria), slug);

  if (!produto) {
    notFound();
  }

  const semEstoque = produto.estoque === 0;
  const paginaAvaliacoes = await buscarAvaliacoesProduto(produto._id!);

  return (
    <div className="container">
      <p className={styles.crumb}>
        <Link href="/produtos">Produtos</Link> ›{" "}
        <Link href={`/produtos/${produto.categoria}`}>{produto.categoria}</Link> › {produto.nome}
      </p>

      <div className={styles.detail}>
        <GaleriaFotosProduto fotos={produto.fotos} nome={produto.nome} />

        <div className={styles.detailInfo}>
          <h1>{produto.nome}</h1>
          <Preco centavos={produto.preco} tamanho="destaque" />
          <p className={styles.detailDesc}>{produto.descricao}</p>

          <div className={styles.datasheet}>
            <div className={styles.datasheetTitle}>ficha técnica</div>
            <dl>
              <dt>categoria</dt>
              <dd>{produto.categoria}</dd>
              <dt>estoque</dt>
              <dd>{semEstoque ? "esgotado" : `${produto.estoque} unidades`}</dd>
              {linhasFichaTecnica(produto.fichaTecnica).map(({ rotulo, valor }) => (
                <Fragment key={rotulo}>
                  <dt>{rotulo}</dt>
                  <dd>{valor}</dd>
                </Fragment>
              ))}
            </dl>
          </div>

          <BotaoAdicionarCarrinho
            produtoId={produto._id!.toString()}
            nome={produto.nome}
            foto={produto.fotos[0] ?? ""}
            categoria={produto.categoria}
            slug={produto.slug}
            preco={produto.preco}
            estoque={produto.estoque}
          />

          <p className={styles.encomendar}>
            {semEstoque ? "Esgotado no momento? " : "Precisa de mais unidades? "}
            <Link href={`/encomendas?produto=${produto._id!.toString()}`}>Encomendar</Link>
          </p>
        </div>
      </div>

      <AvaliacoesProduto
        produtoId={produto._id!.toString()}
        avaliacoesIniciais={paginaAvaliacoes.avaliacoes.map((avaliacao) => ({
          canal: avaliacao.canal,
          nota: avaliacao.nota,
          comentario: avaliacao.comentario ?? null,
          dataAvaliacao: avaliacao.dataAvaliacao.toISOString(),
        }))}
        cursorInicial={paginaAvaliacoes.proximoCursor}
      />
    </div>
  );
}
