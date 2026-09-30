import styles from "./cabecalho.module.css";

/** Busca do cabeçalho (EDI-116, FR-010) — leva ao catálogo já filtrado. */
export default function BuscaHeader() {
  return (
    <form className={styles.busca} action="/produtos" role="search">
      <label className={styles.leitorDeTela} htmlFor="busca-header">
        Buscar produto
      </label>
      <input
        id="busca-header"
        type="search"
        name="q"
        placeholder="Buscar perfume, bijuteria…"
        autoComplete="off"
      />
      <button type="submit" aria-label="Buscar">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
