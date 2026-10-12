import type { StatusTentativaPagamento } from "@/lib/models/pedido";

/**
 * Mapeia o `status` de uma order da API de Orders do Mercado Pago para o
 * status interno de uma tentativa de pagamento. `created`/`processing`/
 * `action_required` (Pix aguardando transferência, cartão em análise) são
 * tratados como "pendente"; `canceled`/`expired` (QR expirado sem
 * pagamento) como "expirado".
 */
export function mapearStatusMercadoPago(statusOrder: string): StatusTentativaPagamento {
  switch (statusOrder) {
    case "processed":
      return "aprovado";
    case "failed":
      return "recusado";
    case "canceled":
    case "cancelled":
    case "expired":
      return "expirado";
    case "created":
    case "processing":
    case "action_required":
    default:
      return "pendente";
  }
}
