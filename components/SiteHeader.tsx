import Link from "next/link";
import { auth } from "@/lib/auth/clienteConfig";
import { auth as authAdmin } from "@/lib/auth/config";
import { listarCategorias } from "@/lib/produtos/repository";
import { dividirCategorias } from "@/lib/site/navegacao";
import SairButton from "./admin/SairButton";
import SairClienteButton from "./cliente/SairClienteButton";
import MenuMobile from "./MenuMobile";
import CarrinhoIcone from "./carrinho/CarrinhoIcone";
import BuscaHeader from "./site/BuscaHeader";
import HeaderScroll from "./site/HeaderScroll";
import MenuCategorias from "./site/MenuCategorias";
import MenuConta from "./site/MenuConta";
import styles from "./SiteHeader.module.css";

/**
 * Cabeçalho da loja (EDI-116).
 *
 * Sessão e categorias são lidas no servidor; só o que precisa de interação
 * (menus suspensos, rolagem, contador do carrinho) é cliente. Fica transparente
 * sobre o banner hero da home — a regra está no CSS, via
 * `body:has([data-hero-topo])`, porque hero e cabeçalho vivem em ramos
 * diferentes da árvore.
 */
export default async function SiteHeader() {
  const [session, sessionAdmin, categorias] = await Promise.all([
    auth(),
    authAdmin(),
    listarCategorias(),
  ]);

  const { naBarra, noMais } = dividirCategorias(categorias);
  const autenticado = Boolean(session?.user);

  // Mesmos destinos no menu do computador e no painel do celular.
  const linksPrincipais = (
    <>
      <Link href="/produtos">Produtos</Link>
      <Link href="/encomendas">Encomendas</Link>
      {categorias.map((categoria) => (
        <Link key={categoria} href={`/produtos/${categoria}`}>
          {categoria}
        </Link>
      ))}
      {autenticado ? (
        <>
          <Link href="/minha-conta">Minha conta</Link>
          <Link href="/minha-conta/pedidos">Pedidos</Link>
          <SairClienteButton className={styles.navBotao} />
        </>
      ) : (
        <>
          <Link href="/entrar">Entrar</Link>
          <Link href="/cadastro">Criar conta</Link>
        </>
      )}
    </>
  );

  // Sem sessão de admin, o proxy leva ao login e volta para o painel depois de entrar.
  const linksAdmin = (
    <>
      <Link href="/admin/produtos">Admin</Link>
      {sessionAdmin?.user && <SairButton className={styles.navBotao} rotulo="Sair do admin" />}
    </>
  );

  return (
    <header className={styles.header}>
      <HeaderScroll />
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand}>
          {/* Marca provisória em texto — o logotipo desenhado entra sem mudar o layout. */}
          <span className={styles.logo}>Dona Frida</span>
        </Link>

        <MenuCategorias naBarra={naBarra} noMais={noMais} />

        <div className={styles.actions}>
          <BuscaHeader />
          <div className={styles.adminLinks}>{linksAdmin}</div>
          <MenuConta
            autenticado={autenticado}
            sair={autenticado ? <SairClienteButton className={styles.menuBotao} /> : undefined}
          />
          <CarrinhoIcone />
          <MenuMobile principal={linksPrincipais} admin={linksAdmin} />
        </div>
      </div>
    </header>
  );
}
