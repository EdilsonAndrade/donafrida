import { ROTULOS_BANHO, type EmbalagemEnvio, type FichaTecnicaProduto, type GeneroProduto, type Produto } from "@/lib/models/produto";
import { obterAccessTokenValido } from "./auth";
import { erroMercadoLivre } from "./erros";

interface ValorAtributoCategoria {
  id: string;
  name: string;
}

export interface AtributoCategoria {
  id: string;
  value_type: string;
  tags?: { required?: boolean };
  values?: ValorAtributoCategoria[];
}

export interface AtributoItem {
  id: string;
  value_id?: string;
  value_name?: string;
}

/**
 * Busca todos os atributos aceitos por uma categoria (obrigatórios e
 * opcionais) — usada tanto por `buscarAtributosObrigatorios` (Marca/Modelo,
 * EDI-95) quanto por `atributosFichaTecnica` (EDI-90, que precisa saber se a
 * categoria expõe `HEIGHT`/`WIDTH`/`LENGTH`/`WEIGHT`/`MATERIAL` mesmo sendo
 * atributos opcionais).
 */
export async function buscarAtributosCategoria(categoryId: string): Promise<AtributoCategoria[]> {
  const token = await obterAccessTokenValido();
  const resposta = await fetch(
    `https://api.mercadolibre.com/categories/${categoryId}/attributes`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!resposta.ok) {
    throw await erroMercadoLivre(
      resposta,
      "Falha ao consultar atributos da categoria no Mercado Livre"
    );
  }

  return (await resposta.json()) as AtributoCategoria[];
}

/**
 * Alguns domínios do Mercado Livre (ex: "decorations", descoberto testando
 * em produção) exigem atributos obrigatórios da categoria mesmo no modelo
 * "User Products" — o próprio Mercado Livre usa esses atributos para montar
 * o título do anúncio (research.md #4); sem eles, `POST /items` falha com
 * "attributes are required" ao tentar gerar o título. Filtra os atributos
 * marcados como obrigatórios (`tags.required`) na categoria já resolvida.
 */
export async function buscarAtributosObrigatorios(
  categoryId: string
): Promise<AtributoCategoria[]> {
  const atributos = await buscarAtributosCategoria(categoryId);
  return atributos.filter((atributo) => atributo.tags?.required);
}

const PADRAO_GENERICO = /gen[eé]ric|n[aã]o especificad|outr[oa]|sem marca/i;

/** Reconhece "Não"/"Nao"/"No" entre as opções de um atributo booleano (ex: "Com USB" → Sim/Não). */
const PADRAO_NAO = /^n(a|ã)o$/i;

/** Marca usada quando o produto não tem `fichaTecnica.marca` (revenda sem marca identificada). */
const MARCA_PADRAO_LOJA = "Dona Frida";

/**
 * Melhor esforço para preencher um atributo obrigatório sem intervenção
 * manual: para listas fechadas (ex: marca), procura uma opção genérica
 * ("Genérica", "Não especificado"); sem opção assim, usa a primeira da
 * lista — o Mercado Livre não aceita texto livre num atributo de lista
 * fechada, então não há como usar a marca real aqui. Para atributos
 * booleanos (`value_type: "boolean"`, ex: "Com USB" — têm `values` com
 * Sim/Não, mas não são `"list"`; descoberto em produção: a categoria
 * "Luminárias de Mesa" tem `WITH_USB` obrigatório e caía no fallback de
 * texto livre, mandando o nome do produto como valor e sendo rejeitado pelo
 * Mercado Livre), assume "Não" — mais seguro que afirmar um recurso ("Sim")
 * que a peça pode não ter de verdade. Para atributos de texto livre,
 * reaproveita o nome do produto — **exceto** `BRAND`, que usa a marca da
 * ficha técnica (fallback `MARCA_PADRAO_LOJA`), para "Marca" e "Modelo" não
 * saírem idênticos quando ambos são obrigatórios de texto livre.
 */
export function valorPadraoAtributo(atributo: AtributoCategoria, produto: Produto): AtributoItem {
  if (atributo.value_type === "boolean" && atributo.values && atributo.values.length > 0) {
    const nao = atributo.values.find((valor) => PADRAO_NAO.test(valor.name.trim()));
    return { id: atributo.id, value_id: (nao ?? atributo.values[0]).id };
  }

  if (atributo.value_type === "list" && atributo.values && atributo.values.length > 0) {
    const generico = atributo.values.find((valor) => PADRAO_GENERICO.test(valor.name));
    return { id: atributo.id, value_id: (generico ?? atributo.values[0]).id };
  }

  if (atributo.id === "BRAND") {
    return { id: atributo.id, value_name: produto.fichaTecnica?.marca ?? MARCA_PADRAO_LOJA };
  }

  return { id: atributo.id, value_name: produto.nome };
}

/**
 * Monta os atributos de peso/dimensões da embalagem pronta para envio
 * (`SELLER_PACKAGE_WEIGHT/HEIGHT/WIDTH/LENGTH`), a partir dos dados
 * informados pelo vendedor — enviados na publicação mesmo quando a
 * categoria não os marca como obrigatórios (EDI-96). É por esses atributos
 * que o Mercado Livre conhece o tamanho real do pacote (o campo
 * `shipping.dimensions` do item é ignorado nesta conta/modelo — ver
 * research.md #2).
 *
 * O valor **precisa** vir com a unidade junto (`"65 g"`, `"16 cm"`): esses
 * atributos são do tipo `number_unit`, e enviar só o número (`"65"`) faz o
 * Mercado Livre **descartar o atributo silenciosamente**, sem erro algum —
 * confirmado em produção comparando dois anúncios do mesmo produto (um
 * publicado com unidade, que gravou os atributos; outro sem unidade, que
 * saiu sem nenhum atributo de embalagem).
 */
export function atributosEmbalagem(embalagem: EmbalagemEnvio): AtributoItem[] {
  return [
    { id: "SELLER_PACKAGE_WEIGHT", value_name: `${embalagem.pesoGramas} g` },
    { id: "SELLER_PACKAGE_HEIGHT", value_name: `${embalagem.alturaCm} cm` },
    { id: "SELLER_PACKAGE_WIDTH", value_name: `${embalagem.larguraCm} cm` },
    { id: "SELLER_PACKAGE_LENGTH", value_name: `${embalagem.comprimentoCm} cm` },
  ];
}

export interface ResultadoFichaTecnica {
  /** Atributos a enviar no item — só os campos preenchidos cuja categoria expõe o atributo correspondente. */
  attributes: AtributoItem[];
  /** Campos preenchidos sem atributo correspondente na categoria — vão para a descrição complementar. */
  paraDescricao: Array<{ rotulo: string; valor: string }>;
}

/**
 * Atributos enviados em toda publicação quando a categoria os expõe, mesmo
 * que não sejam obrigatórios (a qualidade do anúncio cai com eles ausentes):
 * "Fabricante" recebe a marca da ficha técnica — só quando preenchida, pois
 * numa revenda a loja não é a fabricante.
 */
export function atributosFixos(
  atributosCategoria: AtributoCategoria[],
  fichaTecnica?: FichaTecnicaProduto
): AtributoItem[] {
  const idsCategoria = new Set(atributosCategoria.map((atributo) => atributo.id));
  const attributes: AtributoItem[] = [];

  if (idsCategoria.has("MANUFACTURER") && fichaTecnica?.marca) {
    attributes.push({ id: "MANUFACTURER", value_name: fichaTecnica.marca });
  }

  return attributes;
}

/** Gênero da ficha → valor exibido no atributo `GENDER` do Mercado Livre. */
const GENERO_MERCADO_LIVRE: Record<GeneroProduto, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  unissex: "Sem gênero",
};

/**
 * Campos da ficha técnica e os IDs de atributo candidatos, em ordem de
 * prioridade — categorias diferentes usam nomes diferentes para o mesmo
 * conceito, então o primeiro ID que a categoria expõe é o usado; sem nenhum,
 * o valor vai para a descrição. `number_unit` (volume) **precisa** da unidade
 * junto (`"25 mL"`), senão o Mercado Livre descarta o atributo em silêncio.
 */
function camposFichaTecnica(
  ficha: FichaTecnicaProduto
): Array<{ candidatos: string[]; rotulo: string; valor: string | undefined }> {
  return [
    { candidatos: ["BRAND"], rotulo: "Marca", valor: ficha.marca },
    { candidatos: ["MODEL", "LINE"], rotulo: "Modelo", valor: ficha.modelo },
    { candidatos: ["UNIT_VOLUME", "VOLUME"], rotulo: "Volume", valor: ficha.volumeMl ? `${ficha.volumeMl} mL` : undefined },
    { candidatos: ["GENDER"], rotulo: "Gênero", valor: ficha.genero ? GENERO_MERCADO_LIVRE[ficha.genero] : undefined },
    { candidatos: ["OLFACTORY_FAMILY", "FRAGRANCE_FAMILY"], rotulo: "Família olfativa", valor: ficha.familiaOlfativa },
    { candidatos: [], rotulo: "Inspirado em", valor: ficha.inspiradoEm },
    { candidatos: ["MATERIAL", "MAIN_MATERIAL"], rotulo: "Material", valor: ficha.material },
    { candidatos: ["PLATING", "METAL_PLATING", "COATING"], rotulo: "Banho", valor: ficha.banho ? ROTULOS_BANHO[ficha.banho] : undefined },
    { candidatos: ["SIZE"], rotulo: "Tamanho", valor: ficha.tamanho },
  ];
}

/**
 * Mapeia a ficha técnica (perfume/bijuteria) para atributos do Mercado Livre
 * quando a categoria os expõe — cada campo é checado contra todos os
 * atributos da categoria (não só os obrigatórios). Campos sem atributo
 * correspondente (sempre o caso de "inspirado em" e dos itens inclusos) vão
 * para `paraDescricao`, para quem chama complementar a descrição do anúncio.
 * Texto vai como `value_name`, que o Mercado Livre aceita também em listas
 * quando o texto coincide com uma das opções.
 */
export function atributosFichaTecnica(
  fichaTecnica: FichaTecnicaProduto,
  atributosCategoria: AtributoCategoria[]
): ResultadoFichaTecnica {
  const idsCategoria = new Set(atributosCategoria.map((atributo) => atributo.id));
  const attributes: AtributoItem[] = [];
  const paraDescricao: Array<{ rotulo: string; valor: string }> = [];

  for (const { candidatos, rotulo, valor } of camposFichaTecnica(fichaTecnica)) {
    if (valor === undefined) continue;
    const atributoId = candidatos.find((id) => idsCategoria.has(id));
    if (atributoId) {
      attributes.push({ id: atributoId, value_name: valor });
    } else {
      paraDescricao.push({ rotulo, valor });
    }
  }

  if (fichaTecnica.itensInclusos && fichaTecnica.itensInclusos.length > 0) {
    paraDescricao.push({
      rotulo: "Itens inclusos",
      valor: fichaTecnica.itensInclusos.join(", "),
    });
  }

  return { attributes, paraDescricao };
}
