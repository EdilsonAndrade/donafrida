import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { assinaturaWebhookValida } from "@/lib/pagamentos/webhook";
import { buscarOrder, pagamentoDaOrder } from "@/lib/pagamentos/mercadopago";
import { atualizarStatusTentativa } from "@/lib/pagamentos/repository";
import { mapearStatusMercadoPago } from "@/lib/pagamentos/status";

/**
 * Recebe notificações do Mercado Pago (tópico "order", API de Orders). O
 * payload em si nunca é usado como fonte de dados além do `data.id` — os
 * detalhes reais da order vêm sempre de uma consulta subsequente à API
 * (research.md #6).
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const tipo = url.searchParams.get("type") ?? url.searchParams.get("topic");

  const assinaturaOk = assinaturaWebhookValida({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
    secret: process.env.MERCADOPAGO_WEBHOOK_SECRET!,
  });

  if (!assinaturaOk) {
    return NextResponse.json({ erro: "Assinatura inválida." }, { status: 401 });
  }

  if (!dataId || (tipo && tipo !== "order")) {
    // Notificação sem id ou de outro tópico — nada a processar.
    return NextResponse.json({ recebido: true });
  }

  let order;
  try {
    order = await buscarOrder(dataId);
  } catch (erro) {
    // Falha transitória ao consultar a API do Mercado Pago — MP reenvia depois.
    console.error("Falha ao consultar a order no Mercado Pago:", erro);
    return NextResponse.json({ erro: "Falha ao consultar a order." }, { status: 500 });
  }

  const pedidoId = order.external_reference;
  if (!pedidoId || !ObjectId.isValid(pedidoId)) {
    // Order sem referência a um pedido nosso — nada a fazer.
    return NextResponse.json({ recebido: true });
  }

  try {
    await atualizarStatusTentativa(
      pedidoId,
      String(order.id),
      mapearStatusMercadoPago(order.status ?? "created"),
      pagamentoDaOrder(order)?.payment_method?.id ?? "desconhecido"
    );
  } catch (erro) {
    console.error("Falha ao atualizar o pedido a partir do webhook:", erro);
    return NextResponse.json({ erro: "Falha ao atualizar o pedido." }, { status: 500 });
  }

  return NextResponse.json({ recebido: true });
}
