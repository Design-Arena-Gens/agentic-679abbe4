import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MT5 Strategy Studio",
  description: "Ferramentas e táticas para criar estratégias lucrativas e robôs EA no MetaTrader 5."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>{children}</body>
    </html>
  );
}
