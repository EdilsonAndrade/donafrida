"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { CategoriasNavegacao } from "@/lib/site/navegacao";
import styles from "./cabecalho.module.css";

/**
 * Categorias no cabeçalho, com o excedente em "Mais" (EDI-116, FR-009).
 *
 * A divisão vem pronta do servidor (`dividirCategorias`); aqui só existe o
 * estado de abrir e fechar o menu.
 */
export default function MenuCategorias({ naBarra, noMais }: CategoriasNavegacao) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const idMenu = useId();

  useEffect(() => {
    if (!aberto) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    function aoClicar(evento: MouseEvent) {
      if (!containerRef.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("mousedown", aoClicar);

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.removeEventListener("mousedown", aoClicar);
    };
  }, [aberto]);

  if (naBarra.length === 0 && noMais.length === 0) return null;

  return (
    <nav className={styles.categorias} aria-label="Categorias">
      {naBarra.map((categoria) => (
        <Link key={categoria} href={`/produtos/${categoria}`}>
          {categoria}
        </Link>
      ))}

      {noMais.length > 0 && (
        <div className={styles.mais} ref={containerRef}>
          <button
            ref={botaoRef}
            type="button"
            aria-expanded={aberto}
            aria-controls={idMenu}
            onClick={() => setAberto((valor) => !valor)}
          >
            Mais
          </button>
          {aberto && (
            <div className={styles.menuSuspenso} id={idMenu}>
              {noMais.map((categoria) => (
                <Link
                  key={categoria}
                  href={`/produtos/${categoria}`}
                  onClick={() => setAberto(false)}
                >
                  {categoria}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
