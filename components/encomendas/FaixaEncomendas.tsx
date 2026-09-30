import Link from "next/link";
import styles from "./encomendas.module.css";

/** Faixa da vitrine que leva à página /encomendas. */
export default function FaixaEncomendas() {
  return (
    <section className={`${styles.palco} ${styles.faixa}`} aria-labelledby="faixa-encomendas-titulo">
      <div className={styles.faixaTexto}>
        <p className={styles.faixaEyebrow}>revenda, brindes e presentes</p>
        <h2 id="faixa-encomendas-titulo" className={styles.faixaTitulo}>
          Precisa de <span>mais unidades</span>?
        </h2>
        <p className={styles.faixaDescricao}>
          Encomende perfumes e bijuterias em quantidade. A gente confere a disponibilidade e retorna com
          valores e prazo.
        </p>
        <Link href="/encomendas" className={styles.faixaBotao}>
          Fazer uma encomenda →
        </Link>
      </div>
    </section>
  );
}
