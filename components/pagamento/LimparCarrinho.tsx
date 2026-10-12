"use client";

import { useEffect } from "react";
import { useCarrinho } from "@/components/carrinho/carrinho-context";

/**
 * Esvazia o carrinho quando o pedido já está pago. Renderizado pela página do
 * pedido — cobre tanto a aprovação síncrona (cartão) quanto a confirmação
 * posterior via webhook (Pix), assim que o cliente vê o pedido como pago.
 */
export default function LimparCarrinho() {
  const { pronto, itens, limpar } = useCarrinho();

  useEffect(() => {
    // Aguarda a hidratação do localStorage; antes disso os itens ainda não carregaram.
    if (pronto && itens.length > 0) {
      limpar();
    }
  }, [pronto, itens.length, limpar]);

  return null;
}
