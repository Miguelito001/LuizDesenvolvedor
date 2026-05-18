import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuizFlix - Filmes e Séries",
  description: "Descubra milhares de filmes e séries. Pesquise e explore o catálogo completo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-[var(--background)]">
      <body>{children}</body>
    </html>
  );
}
