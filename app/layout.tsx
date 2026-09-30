import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CarrinhoProvider from "@/components/carrinho/CarrinhoProvider";
import CarrinhoDrawer from "@/components/carrinho/CarrinhoDrawer";
import { auth } from "@/lib/auth/clienteConfig";
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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@400;500;600&display=swap"
        />
      </head>
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
