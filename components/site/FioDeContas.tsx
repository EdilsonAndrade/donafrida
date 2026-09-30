import styles from "./FioDeContas.module.css";

interface FioDeContasProps {
  /** Quantidade de contas. */
  total: number;
  /**
   * Índice da conta ativa (0 = primeira). Ausente, o fio é apenas um divisor
   * decorativo, escondido de leitores de tela.
   */
  atual?: number;
  /** Rótulo do grupo quando o fio indica posição. */
  rotulo?: string;
}

/**
 * Fio de contas — o único ornamento do site (EDI-116, research.md §3).
 *
 * Sempre carrega informação: separa as seções da home, indica a posição do
 * carrossel e marca o passo do checkout. Como divisor, é decorativo; como
 * indicador, anuncia a posição.
 */
export default function FioDeContas({ total, atual, rotulo }: FioDeContasProps) {
  if (total <= 0) return null;

  const contas = Array.from({ length: total }, (_, indice) => indice);
  const indicador = atual !== undefined;

  return (
    <div
      className={styles.fio}
      role={indicador ? "group" : undefined}
      aria-label={indicador ? rotulo : undefined}
      aria-hidden={indicador ? undefined : true}
    >
      {contas.map((indice) => (
        <span
          key={indice}
          className={`${styles.conta} ${indicador && indice === atual ? styles.ativa : ""}`}
        >
          {indicador && indice === atual && rotulo && (
            <span className={styles.leitorDeTela}>{`${indice + 1} de ${total}`}</span>
          )}
        </span>
      ))}
    </div>
  );
}
