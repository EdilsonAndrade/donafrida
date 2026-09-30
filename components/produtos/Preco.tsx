import { formatarPreco } from "@/lib/produtos/formato";
import styles from "./produtos.module.css";

interface PrecoProps {
  /** Preço cheio, em centavos. */
  centavos: number;
  /**
   * Preço promocional, em centavos. Ausente — que é o caso de todo produto até
   * o EDI-122 criar o campo —, mostra apenas o preço cheio, sem selo.
   */
  promocionalCentavos?: number | null;
  /** `destaque` aumenta o corpo, para a página de produto. */
  tamanho?: "card" | "destaque";
}

/**
 * Preço da loja, com selo de promoção opcional (EDI-116, FR-019/FR-029).
 *
 * Único lugar que decide como o preço aparece — card, carrossel e página de
 * produto usam este componente, então o selo acende em todos de uma vez quando
 * o preço promocional existir.
 */
export default function Preco({ centavos, promocionalCentavos, tamanho = "card" }: PrecoProps) {
  const emPromocao =
    typeof promocionalCentavos === "number" &&
    promocionalCentavos > 0 &&
    promocionalCentavos < centavos;

  const classe = `${styles.preco} ${tamanho === "destaque" ? styles.precoDestaque : ""}`;

  if (!emPromocao) {
    return <p className={classe}>{formatarPreco(centavos)}</p>;
  }

  return (
    <p className={classe}>
      <span className={styles.selo}>Promoção</span>
      <s className={styles.precoCheio}>
        <span className={styles.leitorDeTela}>De </span>
        {formatarPreco(centavos)}
      </s>{" "}
      <span className={styles.precoPromocional}>
        <span className={styles.leitorDeTela}>por </span>
        {formatarPreco(promocionalCentavos)}
      </span>
    </p>
  );
}
