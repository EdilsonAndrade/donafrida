"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./cabecalho.module.css";

interface MenuContaProps {
  /** Verdadeiro quando há sessão de cliente aberta (lida no servidor). */
  autenticado: boolean;
  /** Botão de sair, montado no servidor para reaproveitar a ação existente. */
  sair?: React.ReactNode;
}

/**
 * Menu suspenso da conta (EDI-116, FR-011).
 *
 * Fecha com Esc e com clique fora, devolvendo o foco ao botão — o mesmo
 * contrato do painel do carrinho, para o teclado se comportar igual nos dois.
 */
export default function MenuConta({ autenticado, sair }: MenuContaProps) {
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

  return (
    <div className={styles.conta} ref={containerRef}>
      <button
        ref={botaoRef}
        type="button"
        className={styles.iconeBotao}
        aria-expanded={aberto}
        aria-controls={idMenu}
        aria-label="Minha conta"
        onClick={() => setAberto((valor) => !valor)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
      </button>

      {aberto && (
        <div className={styles.menuSuspenso} id={idMenu}>
          {autenticado ? (
            <>
              <Link href="/minha-conta/pedidos" onClick={() => setAberto(false)}>
                Pedidos
              </Link>
              <Link href="/minha-conta" onClick={() => setAberto(false)}>
                Perfil
              </Link>
              {sair}
            </>
          ) : (
            <>
              <Link href="/entrar" onClick={() => setAberto(false)}>
                Entrar
              </Link>
              <Link href="/cadastro" onClick={() => setAberto(false)}>
                Criar conta
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
