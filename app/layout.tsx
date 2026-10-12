import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CarrinhoProvider from "@/components/carrinho/CarrinhoProvider";
import CarrinhoDrawer from "@/components/carrinho/CarrinhoDrawer";
import { auth } from "@/lib/auth/clienteConfig";
import { manrope } from "./fontes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dona Frida",
  description: "Perfumes e bijuterias com preço justo — compre online na Dona Frida.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <CarrinhoProvider autenticado={Boolean(session?.user)}>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CarrinhoDrawer />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
