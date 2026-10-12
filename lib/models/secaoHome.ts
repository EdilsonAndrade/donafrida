import type { ObjectId } from "mongodb";

export const SECOES_HOME_COLLECTION = "secoesHome";

/** Tipos de bloco que o admin pode montar na home (EDI-114). */
export const TIPOS_SECAO_HOME = [
  "bannerHero",
  "bannerIntermediario",
  "textoDestaque",
  "carrossel",
] as const;
export type TipoSecaoHome = (typeof TIPOS_SECAO_HOME)[number];

export const ALINHAMENTOS_HORIZONTAIS = ["esquerda", "centro", "direita"] as const;
export type AlinhamentoHorizontal = (typeof ALINHAMENTOS_HORIZONTAIS)[number];

export const ALINHAMENTOS_VERTICAIS = ["topo", "meio", "base"] as const;
export type AlinhamentoVertical = (typeof ALINHAMENTOS_VERTICAIS)[number];

/**
 * Cores do texto dos banners. A paleta fica salva pelo nome; o hex é fixo
 * (não muda com o tema), porque o texto fica sobre a foto. Para fotos que não
 * combinam com nenhuma, o admin também aceita uma cor livre "#rrggbb".
 */
export const CORES_MARCA_BANNER = ["branco", "creme", "nude", "rose", "dourado", "grafite"] as const;
export const CORES_EXTRAS_BANNER = [
  "preto",
  "champanhe",
  "amarelo",
  "coral",
  "terracota",
  "vermelho",
  "vinho",
  "pink",
  "lilas",
  "roxo",
  "azulCeu",
  "azulMarinho",
  "salvia",
  "oliva",
] as const;
export const CORES_TEXTO_BANNER = [...CORES_MARCA_BANNER, ...CORES_EXTRAS_BANNER] as const;
export type CorPaletaBanner = (typeof CORES_TEXTO_BANNER)[number];
/** Nome da paleta ou hex livre ("#rrggbb"). */
export type CorTextoBanner = CorPaletaBanner | `#${string}`;

export const HEX_COR_TEXTO_BANNER: Record<CorPaletaBanner, string> = {
  branco: "#ffffff",
  creme: "#f4e8e8",
  nude: "#d8c6c4",
  rose: "#c99a9a",
  dourado: "#c8a96a",
  grafite: "#2b2626",
  preto: "#111111",
  champanhe: "#f3e3c3",
  amarelo: "#f2c94c",
  coral: "#f08a6c",
  terracota: "#b5603c",
  vermelho: "#c0392b",
  vinho: "#6e1f2f",
  pink: "#e46a9b",
  lilas: "#b9a3d6",
  roxo: "#5b3f8c",
  azulCeu: "#8ec5e8",
  azulMarinho: "#1f2f4f",
  salvia: "#a3b18a",
  oliva: "#556b2f",
};

export const ROTULOS_COR_TEXTO_BANNER: Record<CorPaletaBanner, string> = {
  branco: "Branco",
  creme: "Creme",
  nude: "Nude",
  rose: "Rosé",
  dourado: "Dourado",
  grafite: "Grafite",
  preto: "Preto",
  champanhe: "Champanhe",
  amarelo: "Amarelo",
  coral: "Coral",
  terracota: "Terracota",
  vermelho: "Vermelho",
  vinho: "Vinho",
  pink: "Pink",
  lilas: "Lilás",
  roxo: "Roxo",
  azulCeu: "Azul-céu",
  azulMarinho: "Azul-marinho",
  salvia: "Sálvia",
  oliva: "Verde-oliva",
};

/** Cor usada quando o banner não tem cor salva — mantém o visual dos banners antigos. */
export const COR_TEXTO_BANNER_PADRAO = {
  corSubtitulo: "dourado",
  corTitulo: "branco",
  corTexto: "branco",
} as const satisfies Record<string, CorTextoBanner>;

const HEX_LIVRE = /^#[0-9a-f]{6}$/i;

export function corTextoBannerValida(cor: unknown): cor is CorTextoBanner {
  return (
    typeof cor === "string" &&
    (HEX_LIVRE.test(cor) || (CORES_TEXTO_BANNER as readonly string[]).includes(cor))
  );
}

export function hexCorTextoBanner(cor: CorTextoBanner): string {
  return cor.startsWith("#") ? cor : HEX_COR_TEXTO_BANNER[cor as CorPaletaBanner];
}

/** Texto escuro pede véu claro atrás dele (em vez do véu escuro padrão). */
export function corTextoBannerEscura(cor: CorTextoBanner): boolean {
  const hex = hexCorTextoBanner(cor);
  const canal = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  const luminancia = 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
  return luminancia < 0.45;
}

/** Limites de texto — protegem o layout do texto sobreposto à imagem. */
export const LIMITES_SECAO_HOME = {
  titulo: 80,
  subtitulo: 160,
  texto: 300,
  textoBotao: 30,
  carrosselMin: 4,
  carrosselMax: 24,
  carrosselPadrao: 12,
} as const;

export const ROTULOS_TIPO_SECAO: Record<TipoSecaoHome, string> = {
  bannerHero: "Banner principal",
  bannerIntermediario: "Banner intermediário",
  textoDestaque: "Texto de destaque",
  carrossel: "Carrossel de produtos",
};

export interface BotaoSecao {
  texto: string;
  /** Caminho interno ("/produtos/...") ou URL externa https. */
  link: string;
}

interface SecaoHomeBase {
  _id?: ObjectId;
  tipo: TipoSecaoHome;
  ativa: boolean;
  /** Posição na home — ordenação crescente. */
  ordem: number;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface SecaoBanner extends SecaoHomeBase {
  tipo: "bannerHero" | "bannerIntermediario";
  imagemDesktop: string;
  /** Ausente = usa `imagemDesktop` também no celular. */
  imagemMobile?: string;
  titulo?: string;
  subtitulo?: string;
  texto?: string;
  botao?: BotaoSecao;
  alinhamentoHorizontal: AlinhamentoHorizontal;
  alinhamentoVertical: AlinhamentoVertical;
  /** Ausentes = `COR_TEXTO_BANNER_PADRAO`. */
  corSubtitulo?: CorTextoBanner;
  corTitulo?: CorTextoBanner;
  corTexto?: CorTextoBanner;
}

export interface SecaoTextoDestaque extends SecaoHomeBase {
  tipo: "textoDestaque";
  titulo: string;
  texto?: string;
  botao?: BotaoSecao;
}

export interface SecaoCarrossel extends SecaoHomeBase {
  tipo: "carrossel";
  titulo: string;
  linkVerTudo?: string;
  /** Quantos produtos a home exibe — o restante fica no "Ver tudo". */
  limite: number;
  /** Produtos marcados, na ordem de exibição — fonte da verdade da marcação. */
  produtoIds: ObjectId[];
}

export type SecaoHome = SecaoBanner | SecaoTextoDestaque | SecaoCarrossel;

export function ehBanner(secao: SecaoHome): secao is SecaoBanner {
  return secao.tipo === "bannerHero" || secao.tipo === "bannerIntermediario";
}
