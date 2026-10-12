import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { atualizarStatusTentativa, buscarPedidoPorId } from "@/lib/pagamentos/repository";
import { buscarOrder, mensagemErroMercadoPago, pagamentoDaOrder } from "@/lib/pagamentos/mercadopago";
import { mapearStatusMercadoPago } from "@/lib/pagamentos/status";

/**
 * Status do pagamento de um pedido, consultado em intervalos pela tela do Pix.
 * Se a última tentativa ainda estiver "pendente", consulta a order direto no
 * Mercado Pago e sincroniza o pedido — assim a confirmação não depende só do
 * webhook chegar.
 */
export async function GET(request: Request) {
  const pedidoId = new URL(request.url).searchParams.get("pedidoId");
  if (!pedidoId || !ObjectId.isValid(pedidoId)) {
    return NextResponse.json({ erro: "pedidoId inválido." }, { status: 400 });
  }

  const pedido = await buscarPedidoPorId(pedidoId);
  if (!pedido) {
    return NextResponse.json({ erro: "Pedido não encontrado." }, { status: 404 });
  }

  const tentativa = pedido.pagamento.tentativas.at(-1);
  if (pedido.status === "pago" || !tentativa || tentativa.status !== "pendente") {
    return NextResponse.json({
      pedido: { id: pedidoId, status: pedido.status },
      tentativa: tentativa ? { status: tentativa.status } : null,
    });
  }

  let order;
  try {
    order = await buscarOrder(tentativa.referenciaExterna);
  } catch (erro) {
    console.error("Falha ao consultar a order no Mercado Pago:", erro);
    return NextResponse.json(
      { erro: "Falha ao consultar o pagamento.", detalhe: mensagemErroMercadoPago(erro) },
      { status: 502 }
    );
  }

  const novoStatus = mapearStatusMercadoPago(order.status ?? "created");
  if (novoStatus !== "pendente") {
    await atualizarStatusTentativa(
      pedidoId,
      tentativa.referenciaExterna,
      novoStatus,
      pagamentoDaOrder(order)?.payment_method?.id ?? tentativa.metodo
    );
  }

  return NextResponse.json({
    pedido: { id: pedidoId, status: novoStatus === "aprovado" ? "pago" : pedido.status },
    tentativa: { status: novoStatus, motivo: order.status_detail ?? null },
  });
}
