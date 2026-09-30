"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProdutoCarrossel } from "@/lib/home/secoesPublicas";
import Preco from "@/components/produtos/Preco";
import FioDeContas from "@/components/site/FioDeContas";
import styles from "./home.module.css";

export interface CarrosselProdutosProps {
  titulo: string;
  linkVerTudo?: string;
  produtos: ProdutoCarrossel[];
}

export default function CarrosselProdutos({ titulo, linkVerTudo, produtos }: CarrosselProdutosProps) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);
  // Páginas do trilho e página atual, para o fio de contas (research.md §3).
  const [paginas, setPaginas] = useState(1);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const atualizarSetas = useCallback(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    setPodeVoltar(trilho.scrollLeft > 4);
    setPodeAvancar(trilho.scrollLeft + trilho.clientWidth < trilho.scrollWidth - 4);

    const largura = trilho.clientWidth;
    if (largura > 0) {
      setPaginas(Math.max(1, Math.ceil(trilho.scrollWidth / largura)));
      setPaginaAtual(Math.round(trilho.scrollLeft / largura));
    }
  }, []);

  useEffect(() => {
    atualizarSetas();
    window.addEventListener("resize", atualizarSetas);
    return () => window.removeEventListener("resize", atualizarSetas);
  }, [atualizarSetas]);

  function rolar(direcao: 1 | -1) {
    const trilho = trilhoRef.current;
    if (trilho) trilho.scrollBy({ left: direcao * trilho.clientWidth * 0.9 });
  }

  const externo = linkVerTudo?.startsWith("https://");

  return (
    <section aria-label={titulo}>
      <div className={styles.carrosselTopo}>
        <h2 className={styles.carrosselTitulo}>{titulo}</h2>
        <div className={styles.carrosselAcoes}>
          {linkVerTudo &&
            (externo ? (
              <a href={linkVerTudo} className={styles.verTudo} target="_blank" rel="noopener noreferrer">
                Ver tudo →
              </a>
            ) : (
              <Link href={linkVerTudo} className={styles.verTudo}>
                Ver tudo →
              </Link>
            ))}
        </div>
      </div>

      <div className={styles.trilhoMoldura}>
        {/* Setas nas laterais, sobre o primeiro/último card; só aparecem quando há para onde rolar. */}
        {podeVoltar && (
          <button
            type="button"
            className={`${styles.seta} ${styles.setaAnterior}`}
            onClick={() => rolar(-1)}
            aria-label={`Produtos anteriores de ${titulo}`}
          >
            ←
          </button>
        )}
        {podeAvancar && (
          <button
            type="button"
            className={`${styles.seta} ${styles.setaProxima}`}
            onClick={() => rolar(1)}
            aria-label={`Próximos produtos de ${titulo}`}
          >
            →
          </button>
        )}

        <div className={styles.trilho} ref={trilhoRef} onScroll={atualizarSetas}>
          {produtos.map((produto) => (
            <Link key={produto.id} href={produto.href} className={styles.item}>
              <div className={styles.itemFoto}>
                {produto.foto && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={produto.foto} alt={produto.nome} loading="lazy" />
                )}
                {produto.esgotado && <span className={styles.esgotado}>Esgotado</span>}
              </div>
              <div className={styles.itemCorpo}>
                <h3 className={styles.itemNome}>{produto.nome}</h3>
                <Preco centavos={produto.preco} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {paginas > 1 && (
        <FioDeContas total={paginas} atual={paginaAtual} rotulo={`Posição em ${titulo}`} />
      )}
    </section>
  );
}
