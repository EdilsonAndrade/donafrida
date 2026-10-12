import { MercadoPagoConfig, Order } from "mercadopago";

export type OrderRequisicao = Parameters<Order["create"]>[0]["body"];
export type OrderResposta = Awaited<ReturnType<Order["get"]>>;

let clienteOrder: Order | undefined;

function getOrderClient(): Order {
  if (!clienteOrder) {
    const config = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
    clienteOrder = new Order(config);
  }
  return clienteOrder;
}

/** Cria uma order na API de Orders (`POST /v1/orders`). O SDK já envia o `X-Idempotency-Key`. */
export async function criarOrder(body: OrderRequisicao): Promise<OrderResposta> {
  return getOrderClient().create({ body });
}

export async function buscarOrder(id: string): Promise<OrderResposta> {
  return getOrderClient().get({ id });
}

/** Primeira transação de pagamento da order — cada tentativa nossa cria uma order com um único pagamento. */
export function pagamentoDaOrder(order: OrderResposta) {
  return order.transactions?.payments?.[0];
}

/**
 * Extrai uma mensagem legível de um erro lançado pelo SDK (corpo JSON da API
 * do Mercado Pago ou `Error` comum), para devolver ao cliente sem esconder a causa.
 */
export function mensagemErroMercadoPago(erro: unknown): string {
  if (erro && typeof erro === "object") {
    const corpo = erro as { message?: unknown; errors?: Array<{ message?: unknown; details?: unknown }> };
    const detalhes = corpo.errors
      ?.map((e) => [e.message, ...(Array.isArray(e.details) ? e.details : [])].filter(Boolean).join(": "))
      .filter(Boolean);
    if (detalhes?.length) return detalhes.join(" | ");
    if (typeof corpo.message === "string" && corpo.message) return corpo.message;
  }
  return "erro desconhecido";
}
