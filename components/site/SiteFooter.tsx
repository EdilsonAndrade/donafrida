import Link from "next/link";
import { whatsappLoja } from "@/lib/site/contato";
import styles from "./SiteFooter.module.css";

/**
 * Rodapé da loja (EDI-116, FR-020/FR-021).
 *
 * Canal não configurado simplesmente não aparece — nada de espaço vazio nem de
 * link morto. O bloco de novidades ainda não guarda endereço (FR-027): com
 * WhatsApp configurado ele convida pelo canal que a loja realmente usa; sem
 * ele, o campo fica desabilitado e diz que a inscrição não está aberta.
 */
export default function SiteFooter() {
  const whatsapp = whatsappLoja();
  const email = process.env.LOJA_EMAIL_CONTATO?.trim() || null;
  const ano = new Date().getFullYear();

  return (
    <footer className={styles.rodape}>
      <div className={`container ${styles.grade}`}>
        <section className={styles.coluna}>
          <h2 className={styles.titulo}>Loja</h2>
          <ul className={styles.lista}>
            <li>
              <Link href="/produtos">Todos os produtos</Link>
            </li>
            <li>
              <Link href="/encomendas">Encomendas em quantidade</Link>
            </li>
            <li>
              <Link href="/carrinho">Carrinho</Link>
            </li>
            <li>
              <Link href="/minha-conta/pedidos">Meus pedidos</Link>
            </li>
          </ul>
        </section>

        <section className={styles.coluna}>
          <h2 className={styles.titulo}>Conecte-se</h2>
          {whatsapp || email ? (
            <ul className={styles.lista}>
              {whatsapp && (
                <li>
                  <a href={whatsapp.url} target="_blank" rel="noopener noreferrer">
                    WhatsApp {whatsapp.texto}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
            </ul>
          ) : (
            <p className={styles.nota}>Em breve, nossos canais de atendimento.</p>
          )}
        </section>

        <section className={`${styles.coluna} ${styles.novidades}`}>
          <h2 className={styles.titulo}>Receba novidades</h2>
          {whatsapp ? (
            <>
              <p className={styles.nota}>
                Perfume novo e peça nova chegam primeiro pelo WhatsApp.
              </p>
              <a className={styles.botao} href={whatsapp.url} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </a>
            </>
          ) : (
            <>
              <p className={styles.nota}>
                A inscrição por e-mail ainda não está aberta. Volte em breve.
              </p>
              <div className={styles.campo}>
                <label className={styles.leitorDeTela} htmlFor="rodape-novidades">
                  Seu e-mail
                </label>
                <input
                  id="rodape-novidades"
                  type="email"
                  placeholder="seu@email.com"
                  disabled
                  aria-describedby="rodape-novidades-aviso"
                />
                <button type="button" disabled>
                  Inscrever
                </button>
              </div>
              <p id="rodape-novidades-aviso" className={styles.nota}>
                Campo indisponível no momento.
              </p>
            </>
          )}
        </section>
      </div>

      <div className={`container ${styles.base}`}>
        <p>© {ano} Dona Frida. Perfumes e bijuterias.</p>
        <Link href="/termos">Termos e políticas</Link>
      </div>
    </footer>
  );
}
