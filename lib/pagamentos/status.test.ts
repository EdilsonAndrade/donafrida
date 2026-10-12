import { describe, expect, it } from "vitest";
import { mapearStatusMercadoPago } from "./status";

describe("mapearStatusMercadoPago", () => {
  it("mapeia 'processed' para 'aprovado'", () => {
    expect(mapearStatusMercadoPago("processed")).toBe("aprovado");
  });

  it("mapeia 'failed' para 'recusado'", () => {
    expect(mapearStatusMercadoPago("failed")).toBe("recusado");
  });

  it("mapeia 'canceled' e 'expired' para 'expirado'", () => {
    expect(mapearStatusMercadoPago("canceled")).toBe("expirado");
    expect(mapearStatusMercadoPago("expired")).toBe("expirado");
  });

  it("mapeia 'action_required' (Pix aguardando) para 'pendente'", () => {
    expect(mapearStatusMercadoPago("action_required")).toBe("pendente");
  });

  it("mapeia 'processing' para 'pendente'", () => {
    expect(mapearStatusMercadoPago("processing")).toBe("pendente");
  });

  it("mapeia status desconhecido para 'pendente' (fallback seguro)", () => {
    expect(mapearStatusMercadoPago("qualquer_coisa_nova")).toBe("pendente");
  });
});
