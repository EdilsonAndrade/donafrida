"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { calcularTotais } from "@/lib/carrinho/carrinho";
import { formatarPreco } from "@/lib/produtos/formato";
import { useCarrinho } from "./carrinho-context";
import styles from "./carrinho.module.css";

/**
 * Painel lateral do carrinho (EDI-116, FR-014 a FR-017).
 *
 * Usa <dialog> nativo: a prisão de foco, o fechamento por Esc, o `aria-modal` e
 * o travamento da rolagem de fundo vêm do navegador, não de código nosso.
 */
export default function CarrinhoDrawer() {
  const { itens, aberto, fechar, autenticado, alterar, remover } = useCarrinho();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { totalItens, totalCentavos } = calcularTotais(itens);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (aberto && !dialog.open) {
      dialog.showModal();
    } else if (!aberto && dialog.open) {
      dialog.close();
    }
  }, [aberto]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      aria-label="Carrinho"
      // Esc e clique no backdrop disparam `close`; o estado acompanha o navegador.
      onClose={fechar}
      onClick={(evento) => {
        if (evento.target === dialogRef.current) fechar();
      }}
    >
      <div className={styles.drawerTopo}>
        <h2 className={styles.drawerTitulo}>
          Carrinho{totalItens > 0 ? ` (${totalItens})` : ""}
        </h2>
        <button type="button" onClick={fechar} aria-label="Fechar carrinho" className={styles.drawerFechar}>
          ×
        </button>
      </div>

      {itens.length === 0 ? (
        <div className={styles.drawerVazio}>
          <p>Seu carrinho ainda está vazio.</p>
          <button type="button" className={styles.drawerAcao} onClick={fechar}>
            Voltar à loja
          </button>
          {!autenticado && (
            <p className={styles.drawerNota}>
              Já é cliente? <Link href="/entrar">Entre na sua conta</Link> para ver seus pedidos.
            </p>
          )}
        </div>
      ) : (
        <>
          <ul className={styles.drawerLista}>
            {itens.map((item) => (
              <li key={item.produtoId} className={styles.drawerItem}>
                <div className={styles.drawerItemInfo}>
                  <span className={styles.drawerItemNome}>{item.nome}</span>
                  <span className={styles.drawerItemPreco}>{formatarPreco(item.preco)}</span>
                </div>
                <div className={styles.drawerItemAcoes}>
                  <label className={styles.leitorDeTela} htmlFor={`qtd-${item.produtoId}`}>
                    Quantidade de {item.nome}
                  </label>
                  <input
                    id={`qtd-${item.produtoId}`}
                    type="number"
                    min={1}
                    max={item.estoque || undefined}
                    value={item.quantidade}
                    onChange={(evento) =>
                      alterar(item.produtoId, Math.min(item.estoque || 1, Math.max(1, Number(evento.target.value) || 1)))
                    }
                  />
                  <button type="button" onClick={() => remover(item.produtoId)}>
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.drawerRodape}>
            <p className={styles.drawerSubtotal}>
              <span>Subtotal</span>
              <strong>{formatarPreco(totalCentavos)}</strong>
            </p>
            <Link href="/checkout" className={styles.drawerAcao} onClick={fechar}>
              Finalizar compra
            </Link>
            <button type="button" className={styles.drawerSecundaria} onClick={fechar}>
              Continuar comprando
            </button>
            <Link href="/carrinho" className={styles.drawerNota} onClick={fechar}>
              Ver o carrinho completo
            </Link>
          </div>
        </>
      )}
    </dialog>
  );
}
