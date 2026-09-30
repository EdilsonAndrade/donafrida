"use client";

import { useCarrinho } from "./carrinho-context";
import { calcularTotais } from "@/lib/carrinho/carrinho";
import styles from "./carrinho.module.css";

/** Ícone do carrinho: abre o painel lateral (EDI-116, FR-013/FR-014). */
export default function CarrinhoIcone() {
  const { itens, abrir } = useCarrinho();
  const { totalItens } = calcularTotais(itens);

  return (
    <button
      type="button"
      onClick={abrir}
      className={styles.icone}
      aria-label={`carrinho com ${totalItens} itens`}
    >
      <svg
        className={styles.iconeSvg}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.6" />
        <circle cx="17" cy="20" r="1.6" />
        <path d="M3 3h2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.3L20 7H6" />
      </svg>
      {totalItens > 0 && <span className={styles.iconeContador}>{totalItens}</span>}
    </button>
  );
}
