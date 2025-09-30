import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/ui/Header";
import { Footer } from "@/ui/Footer";
import { StickyCTA } from "@/ui/StickyCTA";

export const metadata: Metadata = {
  title: "ギャンブルドクター｜ギャンブル依存症オンライン外来",
  description:
    "ギャンブル依存症専門のオンライン外来。匿名相談から予約まで、浦江晋平医師がオンラインで伴走します。",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="bg-white text-slate-900">
        <Header />
        <main className="min-h-screen pb-32 pt-8">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}
