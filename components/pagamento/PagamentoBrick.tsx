"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import StatusPagamento, { type ResultadoTentativa } from "./StatusPagamento";
import styles from "./pagamento.module.css";

/** Intervalo entre consultas do status enquanto o Pix aguarda pagamento. */
const INTERVALO_CONSULTA_MS = 5000;

// Precisa rodar antes do <Payment> montar: o efeito do Brick (filho) roda antes
// de qualquer useEffect deste componente (pai), e sem a Public Key o SDK
// desiste de renderizar com apenas um console.error.
if (typeof window !== "undefined") {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, { locale: "pt-BR" });
}

interface PagamentoBrickProps {
  pedidoId: string;
  valorTotalCentavos: number;
}

export default function PagamentoBrick({ pedidoId, valorTotalCentavos }: PagamentoBrickProps) {
  const router = useRouter();
  const [resultado, setResultado] = useState<ResultadoTentativa | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [chaveBrick, setChaveBrick] = useState(0);

  // Pix não é aprovado na hora como o cartão: consulta o status até sair de
  // "pendente" e então recarrega a página com a confirmação.
  const aguardandoPagamento = resultado?.status === "pendente";
  useEffect(() => {
    if (!aguardandoPagamento) return;

    const intervalo = setInterval(async () => {
      const resposta = await fetch(`/api/pagamentos/status?pedidoId=${pedidoId}`, { cache: "no-store" });
      if (!resposta.ok) return; // erro fica visível na aba Network; tenta de novo no próximo ciclo
      const dados = await resposta.json();
      const status = dados.tentativa?.status;

      if (dados.pedido?.status === "pago" || status === "aprovado") {
        setResultado((atual) => (atual ? { ...atual, status: "aprovado" } : atual));
        router.refresh();
      } else if (status === "recusado" || status === "expirado") {
        setResultado((atual) => (atual ? { ...atual, status } : atual));
      }
    }, INTERVALO_CONSULTA_MS);

    return () => clearInterval(intervalo);
  }, [aguardandoPagamento, pedidoId, router]);

  async function handleSubmit({
    selectedPaymentMethod,
    formData,
  }: {
    selectedPaymentMethod: string;
    formData: unknown;
  }) {
    setErroEnvio(null);

    const resposta = await fetch("/api/pagamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId, tipoMetodo: selectedPaymentMethod, formData }),
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      // 409 (tentativa em andamento/pedido já pago) ou 400/502 — exibido acima do Brick.
      setErroEnvio(dados.erro ?? "Não foi possível processar o pagamento. Tente novamente.");
      throw new Error(dados.erro ?? "Falha ao processar pagamento");
    }

    const novoResultado: ResultadoTentativa = {
      status: dados.tentativa.status,
      metodo: dados.tentativa.metodo,
      qrCode: dados.tentativa.detalhes?.qrCode ?? null,
      qrCodeBase64: dados.tentativa.detalhes?.qrCodeBase64 ?? null,
    };
    setResultado(novoResultado);

    if (novoResultado.status === "aprovado") {
      // O backend já promoveu o pedido a "pago" de forma síncrona — recarrega
      // a página (Server Component) para mostrar a confirmação atualizada.
      router.refresh();
    }
  }

  function tentarNovamente() {
    setResultado(null);
    setErroEnvio(null);
    setChaveBrick((chave) => chave + 1);
  }

  if (resultado) {
    return (
      <StatusPagamento
        resultado={resultado}
        onTentarNovamente={resultado.status === "aprovado" ? undefined : tentarNovamente}
      />
    );
  }

  return (
    <div className={styles.brickContainer}>
      <p className={styles.seloSeguranca}>🔒 pagamento processado com segurança pelo Mercado Pago</p>
      {erroEnvio && <p className={styles.statusTexto}>{erroEnvio}</p>}
      <Payment
        key={chaveBrick}
        initialization={{ amount: valorTotalCentavos / 100 }}
        customization={{
          // Só os meios listados aqui aparecem no Brick: cartão de crédito e Pix.
          paymentMethods: {
            creditCard: "all",
            bankTransfer: "all",
          },
        }}
        onSubmit={handleSubmit}
        onError={(erroBrick) => console.error("Erro no Payment Brick:", erroBrick)}
      />
    </div>
  );
}
