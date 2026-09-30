import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { criarEncomenda, notificarAdminNovaEncomenda, enviarConfirmacaoEncomenda, buscarProdutoPorId } =
  vi.hoisted(() => ({
    criarEncomenda: vi.fn(),
    notificarAdminNovaEncomenda: vi.fn().mockResolvedValue(undefined),
    enviarConfirmacaoEncomenda: vi.fn().mockResolvedValue(undefined),
    buscarProdutoPorId: vi.fn(),
  }));

vi.mock("@/lib/encomendas/repository", () => ({ criarEncomenda }));
vi.mock("@/lib/email/resend", () => ({ notificarAdminNovaEncomenda, enviarConfirmacaoEncomenda }));
vi.mock("@/lib/produtos/repository", () => ({ buscarProdutoPorId }));

const { POST } = await import("./route");

const PRODUTO_ID = new ObjectId("66f1a2b3c4d5e6f708192a3b");

const payloadValido = {
  produtoId: PRODUTO_ID.toString(),
  quantidade: 30,
  nome: "Maria Silva",
  email: "Maria@Exemplo.com",
  telefone: "(19) 99999-8888",
  descricao: "Para brinde de fim de ano.",
};

function requisicao(corpo: unknown) {
  return new Request("http://localhost/api/encomendas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
}

describe("POST /api/encomendas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    criarEncomenda.mockImplementation(async (dados) => ({
      ...dados,
      _id: new ObjectId(),
      criadoEm: new Date(),
    }));
    buscarProdutoPorId.mockResolvedValue({ _id: PRODUTO_ID, nome: "Perfume Nº 126" });
  });

  it("grava a encomenda com o nome do produto vindo do catálogo, avisa a loja e confirma ao cliente", async () => {
    const resposta = await POST(requisicao({ ...payloadValido, produtoNome: "nome forjado pelo cliente" }));

    expect(resposta.status).toBe(201);
    expect(criarEncomenda).toHaveBeenCalledWith({
      produtoId: PRODUTO_ID,
      produtoNome: "Perfume Nº 126",
      quantidade: 30,
      nome: payloadValido.nome,
      email: payloadValido.email,
      telefone: payloadValido.telefone,
      descricao: payloadValido.descricao,
    });
    expect(notificarAdminNovaEncomenda).toHaveBeenCalledTimes(1);
    expect(enviarConfirmacaoEncomenda).toHaveBeenCalledTimes(1);
  });

  it("aceita encomenda sem produto, só com observações", async () => {
    const resposta = await POST(
      requisicao({ ...payloadValido, produtoId: "", descricao: "50 perfumes femininos variados." })
    );

    expect(resposta.status).toBe(201);
    expect(buscarProdutoPorId).not.toHaveBeenCalled();
    expect(criarEncomenda).toHaveBeenCalledWith(expect.objectContaining({ produtoId: undefined, quantidade: 30 }));
  });

  it("responde 400 quando o produto não existe mais no catálogo", async () => {
    buscarProdutoPorId.mockResolvedValue(null);

    const resposta = await POST(requisicao(payloadValido));

    expect(resposta.status).toBe(400);
    const { erros } = await resposta.json();
    expect(erros.produtoId).toBeDefined();
    expect(criarEncomenda).not.toHaveBeenCalled();
  });

  it("responde 400 com os erros por campo e não grava nada", async () => {
    const resposta = await POST(requisicao({ ...payloadValido, telefone: "", quantidade: 0 }));

    expect(resposta.status).toBe(400);
    const { erros } = await resposta.json();
    expect(erros.telefone).toBeDefined();
    expect(erros.quantidade).toBeDefined();
    expect(criarEncomenda).not.toHaveBeenCalled();
    expect(enviarConfirmacaoEncomenda).not.toHaveBeenCalled();
  });

  it("responde 400 para corpo que não é JSON", async () => {
    const resposta = await POST(requisicao("não é json"));
    expect(resposta.status).toBe(400);
    expect(criarEncomenda).not.toHaveBeenCalled();
  });

  it("ignora em silêncio quando o campo-armadilha vem preenchido", async () => {
    const resposta = await POST(requisicao({ ...payloadValido, website: "http://spam.example" }));

    expect(resposta.status).toBe(201);
    expect(criarEncomenda).not.toHaveBeenCalled();
    expect(notificarAdminNovaEncomenda).not.toHaveBeenCalled();
    expect(enviarConfirmacaoEncomenda).not.toHaveBeenCalled();
  });
});
