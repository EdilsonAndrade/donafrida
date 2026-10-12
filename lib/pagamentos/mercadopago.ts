import { randomUUID } from "node:crypto";
import { MercadoPagoConfig, Order } from "mercadopago";

export type OrderRequisicao = Parameters<Order["create"]>[0]["body"];
export type OrderResposta = Awaited<ReturnType<Order["get"]>>;

const URL_ORDERS = "https://api.mercadopago.com/v1/orders";

let clienteOrder: Order | undefined;

function getOrderClient(): Order {
  if (!clienteOrder) {
    const config = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });
    clienteOrder = new Order(config);
  }
  return clienteOrder;
}

/** Erro da API de Orders com o corpo original — o SDK descarta a lista `errors`, que traz o motivo real. */
export class ErroMercadoPago extends Error {
  constructor(
    readonly status: number,
    readonly corpo: unknown
  ) {
    super(`Mercado Pago respondeu HTTP ${status}`);
    this.name = "ErroMercadoPago";
  }
}

/**
 * Cria uma order na API de Orders (`POST /v1/orders`) via fetch direto, para
 * preservar o corpo de erro. Pagamento recusado volta como HTTP 402 com a
 * order (status `failed`) em `data` — nesse caso a order é devolvida
 * normalmente, para ser registrada como tentativa recusada.
 */
export async function criarOrder(body: OrderRequisicao): Promise<OrderResposta> {
  const resposta = await fetch(URL_ORDERS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify(body),
  });
  const corpo = (await resposta.json().catch(() => ({}))) as Record<string, unknown>;

  if (resposta.ok) return corpo as unknown as OrderResposta;

  const orderRecusada = corpo.data as OrderResposta | undefined;
  if (resposta.status === 402 && orderRecusada?.id) return orderRecusada;

  throw new ErroMercadoPago(resposta.status, corpo);
}

export async function buscarOrder(id: string): Promise<OrderResposta> {
  return getOrderClient().get({ id });
}

/** Primeira transação de pagamento da order — cada tentativa nossa cria uma order com um único pagamento. */
export function pagamentoDaOrder(order: OrderResposta) {
  return order.transactions?.payments?.[0];
}

/**
 * Extrai uma mensagem legível de um erro do Mercado Pago (lista `errors` da
 * API de Orders ou `Error` comum), para devolver ao cliente sem esconder a causa.
 */
export function mensagemErroMercadoPago(erro: unknown): string {
  const corpo = (erro instanceof ErroMercadoPago ? erro.corpo : erro) as {
    message?: unknown;
    errors?: Array<{ code?: unknown; message?: unknown; details?: unknown }>;
  } | null;
  const prefixo = erro instanceof ErroMercadoPago ? `HTTP ${erro.status}: ` : "";

  if (corpo && typeof corpo === "object") {
    const detalhes = corpo.errors
      ?.map((e) =>
        [e.code, e.message, ...(Array.isArray(e.details) ? e.details : [])].filter(Boolean).join(": ")
      )
      .filter(Boolean);
    if (detalhes?.length) return prefixo + detalhes.join(" | ");
    if (typeof corpo.message === "string" && corpo.message) return prefixo + corpo.message;
  }
  return prefixo + (erro instanceof Error ? erro.message : "erro desconhecido");
}
