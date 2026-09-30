import type { Metadata } from "next";
import { whatsappLoja } from "@/lib/site/contato";

export const metadata: Metadata = {
  title: "Termos e políticas | Dona Frida",
  description: "Termos de uso, política de privacidade, trocas e devoluções da Dona Frida.",
};

/**
 * Termos e políticas (EDI-116, FR-020).
 *
 * A estrutura está pronta; o texto de cada política é decisão da loja e precisa
 * ser escrito por quem responde por ela. O agente não redige cláusula jurídica.
 */
export default function TermosPage() {
  const whatsapp = whatsappLoja();
  const email = process.env.LOJA_EMAIL_CONTATO?.trim() || null;

  return (
    <main className="container" style={{ padding: "3rem 1.75rem", maxWidth: "70ch" }}>
      <h1>Termos e políticas</h1>

      <section>
        <h2>Termos de uso</h2>
        <p>Conteúdo a definir pela loja.</p>
      </section>

      <section>
        <h2>Política de privacidade</h2>
        <p>Conteúdo a definir pela loja.</p>
      </section>

      <section>
        <h2>Trocas e devoluções</h2>
        <p>Conteúdo a definir pela loja.</p>
      </section>

      <section>
        <h2>Prazos e envio</h2>
        <p>Conteúdo a definir pela loja.</p>
      </section>

      <section>
        <h2>Dúvidas</h2>
        {whatsapp || email ? (
          <p>
            Fale com a gente
            {whatsapp && (
              <>
                {" "}
                pelo{" "}
                <a href={whatsapp.url} target="_blank" rel="noopener noreferrer">
                  WhatsApp {whatsapp.texto}
                </a>
              </>
            )}
            {whatsapp && email && " ou"}
            {email && (
              <>
                {" "}
                por <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
            .
          </p>
        ) : (
          <p>Em breve, nossos canais de atendimento.</p>
        )}
      </section>
    </main>
  );
}
