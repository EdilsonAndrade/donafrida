import { describe, expect, it } from "vitest";
import { whatsappLoja } from "./contato";

describe("whatsappLoja", () => {
  it("formata celular com DDD e monta o link do WhatsApp", () => {
    expect(whatsappLoja("19999998888")).toEqual({
      texto: "(19) 99999-8888",
      url: "https://wa.me/5519999998888",
    });
  });

  it("aceita máscara e o código do país", () => {
    expect(whatsappLoja("+55 (11) 3333-4444")).toEqual({
      texto: "(11) 3333-4444",
      url: "https://wa.me/551133334444",
    });
  });

  it("vazio ou inválido → null", () => {
    expect(whatsappLoja(undefined)).toBeNull();
    expect(whatsappLoja("")).toBeNull();
    expect(whatsappLoja("12345")).toBeNull();
  });
});
