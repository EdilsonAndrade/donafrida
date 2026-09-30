import { redirect } from "next/navigation";
import BannerSecao from "@/components/home/BannerSecao";
import CarrosselProdutos from "@/components/home/CarrosselProdutos";
import TextoDestaqueSecao from "@/components/home/TextoDestaqueSecao";
import FioDeContas from "@/components/site/FioDeContas";
import { secoesPublicas } from "@/lib/home/secoesPublicas";
import styles from "@/components/home/home.module.css";

// Página estática revalidada sob demanda (`revalidatePath("/")` nas rotas do
// admin de banners); os 60s cobrem mudanças indiretas, como estoque e preço
// dos produtos dos carrosséis (EDI-114, research.md #3).
export const revalidate = 60;

/**
 * Home montada no admin (/admin/banners). Sem nenhuma seção ativa, mantém o
 * comportamento anterior: o comprador vai direto para o catálogo.
 */
export default async function Home() {
  const secoes = await secoesPublicas();

  if (secoes.length === 0) {
    redirect("/produtos");
  }

  return (
    <div className={`container ${styles.home}`}>
      {secoes.map((item, indice) => {
        // Só um banner hero na primeira posição deixa o cabeçalho transparente (FR-008).
        const heroNoTopo = indice === 0 && item.tipo === "bannerHero";
        // O fio de contas separa as seções — nunca antes da primeira (research.md §3).
        const divisor = indice > 0 ? <FioDeContas total={5} /> : null;

        const conteudo = (() => {
          switch (item.tipo) {
            case "bannerHero":
            case "bannerIntermediario": {
              const { secao } = item;
              return (
                <BannerSecao
                  tipo={secao.tipo}
                  imagemDesktop={secao.imagemDesktop}
                  imagemMobile={secao.imagemMobile}
                  titulo={secao.titulo}
                  subtitulo={secao.subtitulo}
                  texto={secao.texto}
                  botao={secao.botao}
                  alinhamentoHorizontal={secao.alinhamentoHorizontal}
                  alinhamentoVertical={secao.alinhamentoVertical}
                />
              );
            }
            case "textoDestaque":
              return (
                <TextoDestaqueSecao
                  titulo={item.secao.titulo}
                  texto={item.secao.texto}
                  botao={item.secao.botao}
                />
              );
            case "carrossel":
              return (
                <CarrosselProdutos
                  titulo={item.titulo}
                  linkVerTudo={item.linkVerTudo}
                  produtos={item.produtos}
                />
              );
          }
        })();

        return (
          <div key={item.id} {...(heroNoTopo ? { "data-hero-topo": "" } : {})}>
            {divisor}
            {conteudo}
          </div>
        );
      })}
    </div>
  );
}
