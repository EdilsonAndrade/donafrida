"use client";

import Link from "next/link";
import { useState } from "react";
import AvisoSpam from "@/components/AvisoSpam";
import checkoutStyles from "@/components/checkout/checkout.module.css";
import {
  DESCRICAO_TAMANHO_MAXIMO,
  QUANTIDADE_MAXIMA,
  validarEncomenda,
  type ErrosValidacao,
} from "@/lib/encomendas/validacao";
import { whatsappLoja } from "@/lib/site/contato";
import styles from "./encomendas.module.css";

export interface ProdutoEncomendavel {
  id: string;
  nome: string;
}

const WHATSAPP = whatsappLoja();

export default function FormularioEncomenda({
  produtos,
  produtoInicialId,
}: {
  produtos: ProdutoEncomendavel[];
  /** Vindo de `/encomendas?produto=<id>` (link "Encomendar" da página do produto). */
  produtoInicialId?: string;
}) {
  const [formulario, setFormulario] = useState({
    produtoId: produtos.some((p) => p.id === produtoInicialId) ? (produtoInicialId as string) : "",
    quantidade: "",
    nome: "",
    email: "",
    telefone: "",
    descricao: "",
    website: "",
  });
  const [erros, setErros] = useState<ErrosValidacao>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState<string | null>(null);

  function atualizar(campo: keyof typeof formulario, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    const errosLocais = validarEncomenda(formulario);
    setErros(errosLocais);
    setErroGeral(null);
    if (Object.keys(errosLocais).length > 0) return;

    setEnviando(true);
    try {
      const resposta = await fetch("/api/encomendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formulario, quantidade: Number(formulario.quantidade) }),
      });

      if (resposta.ok) {
        setEmailEnviado(formulario.email.trim());
        return;
      }

      const corpo = (await resposta.json().catch(() => ({}))) as { erros?: ErrosValidacao };
      if (corpo.erros) {
        setErros(corpo.erros);
      } else {
        setErroGeral(
          `Não conseguimos enviar agora (erro ${resposta.status}). Tente de novo em instantes${WHATSAPP ? " ou chame no WhatsApp" : ""}.`
        );
      }
    } catch {
      setErroGeral("Sem conexão com o servidor. Confira sua internet e tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  if (emailEnviado) {
    return (
      <div className={`${styles.cartao} ${styles.sucesso}`} role="status">
        <span className={styles.sucessoBadge}>encomenda recebida</span>
        <h2 className={styles.sucessoTitulo}>Recebemos o seu pedido!</h2>
        <p className={styles.sucessoTexto}>
          Enviamos uma confirmação para <strong>{emailEnviado}</strong>. Vamos conferir a disponibilidade e
          retornamos em breve com valores e prazo.
        </p>
        <AvisoSpam />
        <Link href="/produtos" className={styles.sucessoLink}>
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const semProduto = formulario.produtoId === "";

  return (
    <form className={styles.cartao} onSubmit={enviar} noValidate>
      <p className={styles.cartaoTitulo}>seu pedido</p>

      <div className={checkoutStyles.campos}>
        <div className={`${checkoutStyles.campo} ${checkoutStyles.campoLargo}`}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-produto">
            produto
          </label>
          <select
            id="enc-produto"
            className={checkoutStyles.input}
            value={formulario.produtoId}
            onChange={(e) => atualizar("produtoId", e.target.value)}
            aria-invalid={Boolean(erros.produtoId)}
            aria-describedby={erros.produtoId ? "enc-produto-erro" : undefined}
          >
            <option value="">Outro / vou descrever nas observações</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          {erros.produtoId && (
            <p id="enc-produto-erro" className={checkoutStyles.erroCampo}>
              {erros.produtoId}
            </p>
          )}
        </div>

        <div className={checkoutStyles.campo}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-quantidade">
            quantidade <span>*</span>
          </label>
          <input
            id="enc-quantidade"
            type="number"
            min={1}
            max={QUANTIDADE_MAXIMA}
            step={1}
            inputMode="numeric"
            className={checkoutStyles.input}
            value={formulario.quantidade}
            onChange={(e) => atualizar("quantidade", e.target.value)}
            placeholder="Ex.: 30"
            aria-invalid={Boolean(erros.quantidade)}
            aria-describedby={erros.quantidade ? "enc-quantidade-erro" : undefined}
          />
          {erros.quantidade && (
            <p id="enc-quantidade-erro" className={checkoutStyles.erroCampo}>
              {erros.quantidade}
            </p>
          )}
        </div>

        <div className={checkoutStyles.campo}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-nome">
            nome <span>*</span>
          </label>
          <input
            id="enc-nome"
            className={checkoutStyles.input}
            value={formulario.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? "enc-nome-erro" : undefined}
          />
          {erros.nome && (
            <p id="enc-nome-erro" className={checkoutStyles.erroCampo}>
              {erros.nome}
            </p>
          )}
        </div>

        <div className={checkoutStyles.campo}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-email">
            e-mail <span>*</span>
          </label>
          <input
            id="enc-email"
            type="email"
            className={checkoutStyles.input}
            value={formulario.email}
            onChange={(e) => atualizar("email", e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(erros.email)}
            aria-describedby={erros.email ? "enc-email-erro" : undefined}
          />
          {erros.email && (
            <p id="enc-email-erro" className={checkoutStyles.erroCampo}>
              {erros.email}
            </p>
          )}
        </div>

        <div className={checkoutStyles.campo}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-telefone">
            telefone / WhatsApp <span>*</span>
          </label>
          <input
            id="enc-telefone"
            type="tel"
            className={checkoutStyles.input}
            value={formulario.telefone}
            onChange={(e) => atualizar("telefone", e.target.value)}
            autoComplete="tel"
            placeholder="(19) 99999-8888"
            aria-invalid={Boolean(erros.telefone)}
            aria-describedby={erros.telefone ? "enc-telefone-erro" : undefined}
          />
          {erros.telefone && (
            <p id="enc-telefone-erro" className={checkoutStyles.erroCampo}>
              {erros.telefone}
            </p>
          )}
        </div>

        <div className={`${checkoutStyles.campo} ${checkoutStyles.campoLargo}`}>
          <label className={checkoutStyles.rotulo} htmlFor="enc-descricao">
            observações {semProduto && <span>*</span>}
          </label>
          <textarea
            id="enc-descricao"
            className={`${checkoutStyles.input} ${styles.textarea}`}
            value={formulario.descricao}
            onChange={(e) => atualizar("descricao", e.target.value)}
            placeholder={
              semProduto
                ? "Ex.: 50 perfumes femininos 25 ml variados, para brinde de fim de ano."
                : "Ex.: preciso até dia 20; é para revenda."
            }
            maxLength={DESCRICAO_TAMANHO_MAXIMO}
            aria-invalid={Boolean(erros.descricao)}
            aria-describedby={erros.descricao ? "enc-descricao-erro" : undefined}
          />
          <p className={`${checkoutStyles.statusCampo} ${styles.contador}`}>
            {formulario.descricao.length}/{DESCRICAO_TAMANHO_MAXIMO}
          </p>
          {erros.descricao && (
            <p id="enc-descricao-erro" className={checkoutStyles.erroCampo}>
              {erros.descricao}
            </p>
          )}
        </div>
      </div>

      <div className={styles.armadilha} aria-hidden="true">
        <label htmlFor="enc-website">Não preencha este campo</label>
        <input
          id="enc-website"
          tabIndex={-1}
          autoComplete="off"
          value={formulario.website}
          onChange={(e) => atualizar("website", e.target.value)}
        />
      </div>

      {erroGeral && (
        <div className={checkoutStyles.erroGeral} role="alert">
          {erroGeral}
        </div>
      )}

      <button type="submit" className={checkoutStyles.submit} disabled={enviando}>
        {enviando ? "enviando…" : "Enviar pedido de encomenda"}
      </button>

      {WHATSAPP && (
        <p className={styles.whatsapp}>
          Prefere conversar? Chame no{" "}
          <a href={WHATSAPP.url} target="_blank" rel="noopener noreferrer">
            WhatsApp {WHATSAPP.texto}
          </a>
        </p>
      )}
    </form>
  );
}
