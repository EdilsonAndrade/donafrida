import { NextResponse } from "next/server";
import {
  buscarPedidoPorId,
  existeTentativaAtivaRecente,
  registrarTentativa,
} from "@/lib/pagamentos/repository";
import {
  criarOrder,
  mensagemErroMercadoPago,
  pagamentoDaOrder,
  type OrderRequisicao,
} from "@/lib/pagamentos/mercadopago";
import { mapearStatusMercadoPago } from "@/lib/pagamentos/status";
import { centavosParaReais } from "@/lib/pagamentos/conversao";

/** Subconjunto do `formData` que o Payment Brick envia no `onSubmit`. */
interface FormDataBrick {
  token?: string;
  payment_method_id?: string;
  installments?: number;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    identification?: { type?: string; number?: string };
  };
}

interface PagamentosRequestBody {
  pedidoId?: string;
  /** `selectedPaymentMethod` do Brick: "credit_card", "bank_transfer" (Pix)... */
  tipoMetodo?: string;
  formData?: FormDataBrick;
}

export async function POST(request: Request) {
  const body = (await request.json()) as PagamentosRequestBody;
  const { pedidoId, tipoMetodo, formData } = body;

  if (!pedidoId || !tipoMetodo || !formData?.payment_method_id) {
    return NextResponse.json(
      { erro: "pedidoId, tipoMetodo e formData são obrigatórios." },
      { status: 400 }
    );
  }

  const pedido = await buscarPedidoPorId(pedidoId);
  if (!pedido) {
    return NextResponse.json({ erro: "Pedido não encontrado." }, { status: 404 });
  }

  if (pedido.status === "pago") {
    return NextResponse.json({ erro: "Este pedido já está pago." }, { status: 409 });
  }

  if (await existeTentativaAtivaRecente(pedidoId)) {
    return NextResponse.json(
      { erro: "Já existe uma tentativa de pagamento em andamento para este pedido." },
      { status: 409 }
    );
  }

  // O valor cobrado é sempre o do pedido lido do banco — nunca o que vier do cliente (FR-004).
  // A API de Orders espera valores como string decimal com 2 casas.
  const valor = centavosParaReais(pedido.valorTotal).toFixed(2);
  const requisicao: OrderRequisicao = {
    type: "online",
    processing_mode: "automatic",
    external_reference: pedidoId,
    total_amount: valor,
    payer: {
      email: formData.payer?.email,
      first_name: formData.payer?.first_name,
      last_name: formData.payer?.last_name,
      identification: formData.payer?.identification,
    },
    transactions: {
      payments: [
        {
          amount: valor,
          payment_method: {
            id: formData.payment_method_id,
            type: tipoMetodo,
            token: formData.token,
            installments: formData.installments,
          },
        },
      ],
    },
  };

  let order;
  try {
    order = await criarOrder(requisicao);
  } catch (erro) {
    console.error("Falha ao criar order no Mercado Pago:", erro);
    return NextResponse.json(
      { erro: "Falha ao processar o pagamento.", detalhe: mensagemErroMercadoPago(erro) },
      { status: 502 }
    );
  }

  const pagamento = pagamentoDaOrder(order);
  const statusMapeado = mapearStatusMercadoPago(order.status ?? "created");
  const metodo = pagamento?.payment_method?.id ?? formData.payment_method_id;
  const agora = new Date();

  await registrarTentativa(pedidoId, {
    referenciaExterna: String(order.id),
    metodo,
    status: statusMapeado,
    valor: pedido.valorTotal,
    criadoEm: agora,
    atualizadoEm: agora,
  });

  return NextResponse.json(
    {
      tentativa: {
        referenciaExterna: String(order.id),
        metodo,
        status: statusMapeado,
        detalhes: {
          qrCode: pagamento?.payment_method?.qr_code ?? null,
          qrCodeBase64: pagamento?.payment_method?.qr_code_base64 ?? null,
        },
      },
      pedido: { id: pedidoId, status: statusMapeado === "aprovado" ? "pago" : pedido.status },
    },
    { status: 201 }
  );
}
