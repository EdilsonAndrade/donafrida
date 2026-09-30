import { afterEach, describe, expect, it } from "vitest";
import { renderEmailLayout } from "./templates";

describe("renderEmailLayout", () => {
  afterEach(() => {
    delete process.env.SITE_URL;
    delete process.env.VERCEL_URL;
    delete process.env.EMAIL_FROM;
    delete process.env.NEXT_PUBLIC_LOJA_WHATSAPP;
  });

  it("cabeçalho e rodapé com a marca Dona Frida, sem imagem de logo", () => {
    const html = renderEmailLayout({ titulo: "Título", corpoHtml: "<p>corpo</p>" });
    expect(html).toContain(">Dona Frida</span>");
    expect(html).toContain("Dona Frida");
    expect(html).not.toContain("<img");
    expect(html).not.toMatch(/voxelas/i);
  });

  it("com resposta permitida, cita o WhatsApp da loja só quando NEXT_PUBLIC_LOJA_WHATSAPP está definido", () => {
    const semWhats = renderEmailLayout({ titulo: "T", corpoHtml: "<p>c</p>", permiteResposta: true });
    expect(semWhats).not.toContain("WhatsApp");

    process.env.NEXT_PUBLIC_LOJA_WHATSAPP = "19999998888";
    const comWhats = renderEmailLayout({ titulo: "T", corpoHtml: "<p>c</p>", permiteResposta: true });
    expect(comWhats).toContain("chame no WhatsApp (19) 99999-8888");
  });

  it("inclui o aviso de spam/lixo eletrônico com o remetente", () => {
    process.env.EMAIL_FROM = "Dona Frida <naoresponda@donafrida.com.br>";
    const html = renderEmailLayout({ titulo: "Título", corpoHtml: "<p>corpo</p>" });
    expect(html).toContain("Spam ou no Lixo eletrônico");
    expect(html).toContain("<strong>naoresponda@donafrida.com.br</strong>");
  });

  it("troca o rodapé \"não responda\" quando permiteResposta está ativo", () => {
    const padrao = renderEmailLayout({ titulo: "T", corpoHtml: "<p>c</p>" });
    const comResposta = renderEmailLayout({ titulo: "T", corpoHtml: "<p>c</p>", permiteResposta: true });
    expect(padrao).toContain("não responda");
    expect(comResposta).not.toContain("não responda");
    expect(comResposta).toContain("Responda este e-mail");
  });

  it("inclui título e corpo informados", () => {
    const html = renderEmailLayout({ titulo: "Pedido confirmado", corpoHtml: "<p>Itens comprados</p>" });
    expect(html).toContain("Pedido confirmado");
    expect(html).toContain("Itens comprados");
  });
});
