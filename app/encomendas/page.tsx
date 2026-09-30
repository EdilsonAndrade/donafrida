import FormularioEncomenda from "@/components/encomendas/FormularioEncomenda";
import { listarProdutos } from "@/lib/produtos/repository";
import produtosStyles from "@/components/produtos/produtos.module.css";
import styles from "@/components/encomendas/encomendas.module.css";

export const metadata = {
  title: "Encomendas em quantidade — Dona Frida",
  description:
    "Precisa de mais unidades de um perfume ou bijuteria, para revenda ou brindes? Faça seu pedido de encomenda na Dona Frida.",
};

export default async function EncomendasPage({
  searchParams,
}: {
  searchParams: Promise<{ produto?: string }>;
}) {
  const [{ produto }, produtos] = await Promise.all([searchParams, listarProdutos()]);
  const opcoes = produtos
    .map((p) => ({ id: p._id!.toString(), nome: p.nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <div className={`container ${styles.pagina}`}>
      <div className={produtosStyles.hero}>
        <p className={produtosStyles.eyebrow}>para revenda, brindes e presentes</p>
        <h1>Encomendas em quantidade</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.coluna}>
          <ol className={styles.passos}>
            <li className={styles.passo}>
              <span className={styles.passoIcone} aria-hidden="true">1</span>
              <span>
                <strong>Você faz o pedido</strong>
                Escolha o produto e a quantidade, ou descreva o que precisa nas observações.
              </span>
            </li>
            <li className={styles.passo}>
              <span className={styles.passoIcone} aria-hidden="true">2</span>
              <span>
                <strong>A gente confere</strong>
                Verificamos a disponibilidade com os fornecedores e retornamos por e-mail ou WhatsApp.
              </span>
            </li>
            <li className={styles.passo}>
              <span className={styles.passoIcone} aria-hidden="true">3</span>
              <span>
                <strong>Combinamos valores e prazo</strong>
                Em quantidade, o preço por unidade pode ficar melhor. Fechado o acordo, separamos o seu pedido.
              </span>
            </li>
          </ol>
        </div>

        <FormularioEncomenda produtos={opcoes} produtoInicialId={produto} />
      </div>
    </div>
  );
}
