import Link from "next/link";
import type { BotaoSecao } from "@/lib/models/secaoHome";
import styles from "./home.module.css";

export interface TextoDestaqueSecaoProps {
  titulo: string;
  texto?: string;
  botao?: BotaoSecao;
}

/** Faixa só com texto, entre duas seções da home. */
export default function TextoDestaqueSecao({ titulo, texto, botao }: TextoDestaqueSecaoProps) {
  const externo = botao?.link.startsWith("https://");

  return (
    <section className={styles.destaque}>
      <h2 className={styles.destaqueTitulo}>{titulo}</h2>
      {texto && <p className={styles.destaqueTexto}>{texto}</p>}
      {botao &&
        (externo ? (
          <a href={botao.link} className={styles.botao} target="_blank" rel="noopener noreferrer">
            {botao.texto}
          </a>
        ) : (
          <Link href={botao.link} className={styles.botao}>
            {botao.texto}
          </Link>
        ))}
    </section>
  );
}
