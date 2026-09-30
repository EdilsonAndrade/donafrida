/** WhatsApp da loja pronto para exibir e linkar. */
export interface WhatsAppLoja {
  /** Ex: "(19) 99999-8888". */
  texto: string;
  /** Ex: "https://wa.me/5519999998888". */
  url: string;
}

/**
 * WhatsApp da loja a partir de `NEXT_PUBLIC_LOJA_WHATSAPP` (DDD + número, só
 * dígitos ou com máscara). `NEXT_PUBLIC_` porque o formulário de encomenda
 * (client) também exibe o contato. Vazia ou inválida → `null`, e quem chama
 * simplesmente não mostra o WhatsApp.
 */
export function whatsappLoja(valor = process.env.NEXT_PUBLIC_LOJA_WHATSAPP): WhatsAppLoja | null {
  const digitos = (valor ?? "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (digitos.length !== 10 && digitos.length !== 11) return null;

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const texto = `(${ddd}) ${numero.slice(0, numero.length - 4)}-${numero.slice(-4)}`;

  return { texto, url: `https://wa.me/55${digitos}` };
}
