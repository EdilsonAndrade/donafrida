"use client";

import { useEffect } from "react";

/**
 * Marca `data-rolado` no <html> quando a página sai do topo (EDI-116, FR-008).
 *
 * É o único estado que o cabeçalho transparente precisa do cliente — a decisão
 * de ser transparente vem do CSS, via `body:has([data-hero-topo])`.
 */
export default function HeaderScroll() {
  useEffect(() => {
    const raiz = document.documentElement;

    function aoRolar() {
      if (window.scrollY > 8) {
        raiz.setAttribute("data-rolado", "");
      } else {
        raiz.removeAttribute("data-rolado");
      }
    }

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      window.removeEventListener("scroll", aoRolar);
      raiz.removeAttribute("data-rolado");
    };
  }, []);

  return null;
}
