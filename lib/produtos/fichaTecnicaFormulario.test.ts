import { describe, expect, it } from "vitest";
import {
  camposFichaTecnicaPreenchidos,
  fichaTecnicaParaFormulario,
  montarFichaTecnica,
  VAZIO_FICHA_TECNICA,
  type FichaTecnicaFormValores,
} from "./fichaTecnicaFormulario";

const FORM_PERFUME_COMPLETO: FichaTecnicaFormValores = {
  marca: "Brand Collection",
  modelo: "Nº 126",
  volumeMl: "25",
  genero: "feminino",
  familiaOlfativa: "Floral frutado",
  inspiradoEm: "Good Girl",
  material: "",
  banho: "",
  tamanho: "",
  itensInclusos: "1 frasco 25 ml\n1 caixa",
};

const FICHA_PERFUME_COMPLETA = {
  marca: "Brand Collection",
  modelo: "Nº 126",
  volumeMl: 25,
  genero: "feminino" as const,
  familiaOlfativa: "Floral frutado",
  inspiradoEm: "Good Girl",
  itensInclusos: ["1 frasco 25 ml", "1 caixa"],
};

describe("montarFichaTecnica", () => {
  it("retorna undefined quando nada foi preenchido", () => {
    expect(montarFichaTecnica(VAZIO_FICHA_TECNICA)).toBeUndefined();
  });

  it("converte os campos de perfume preenchidos", () => {
    expect(montarFichaTecnica(FORM_PERFUME_COMPLETO)).toEqual(FICHA_PERFUME_COMPLETA);
  });

  it("converte os campos de bijuteria preenchidos", () => {
    const form: FichaTecnicaFormValores = {
      ...VAZIO_FICHA_TECNICA,
      material: " Aço inoxidável ",
      banho: "ouro",
      tamanho: "Aro 16",
    };
    expect(montarFichaTecnica(form)).toEqual({ material: "Aço inoxidável", banho: "ouro", tamanho: "Aro 16" });
  });

  it("ignora volume inválido (zero, fracionado, não numérico) sem descartar os demais", () => {
    for (const volumeMl of ["0", "25,5", "abc", "-3"]) {
      expect(montarFichaTecnica({ ...VAZIO_FICHA_TECNICA, volumeMl, marca: "X" })).toEqual({ marca: "X" });
    }
  });

  it("ignora linhas vazias de itensInclusos", () => {
    const form: FichaTecnicaFormValores = { ...VAZIO_FICHA_TECNICA, itensInclusos: "1 frasco\n\n1 caixa\n" };
    expect(montarFichaTecnica(form)).toEqual({ itensInclusos: ["1 frasco", "1 caixa"] });
  });
});

describe("camposFichaTecnicaPreenchidos", () => {
  it("retorna false para o formulário vazio", () => {
    expect(camposFichaTecnicaPreenchidos(VAZIO_FICHA_TECNICA)).toBe(false);
  });

  it("retorna true quando ao menos um campo foi escolhido", () => {
    expect(camposFichaTecnicaPreenchidos({ ...VAZIO_FICHA_TECNICA, genero: "unissex" })).toBe(true);
  });
});

describe("fichaTecnicaParaFormulario", () => {
  it("retorna o formulário vazio quando a ficha técnica é undefined", () => {
    expect(fichaTecnicaParaFormulario(undefined)).toEqual(VAZIO_FICHA_TECNICA);
  });

  it("converte uma ficha salva de volta para o formulário (ida e volta sem perda)", () => {
    expect(fichaTecnicaParaFormulario(FICHA_PERFUME_COMPLETA)).toEqual(FORM_PERFUME_COMPLETO);
  });

  it("converte uma ficha parcial, deixando os demais campos vazios", () => {
    expect(fichaTecnicaParaFormulario({ banho: "prata" })).toEqual({ ...VAZIO_FICHA_TECNICA, banho: "prata" });
  });
});
