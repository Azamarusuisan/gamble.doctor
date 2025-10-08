import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/ui/Header";
import { Footer } from "@/ui/Footer";
import { ChatBot } from "@/ui/ChatBot";

export const metadata: Metadata = {
  title: "ギャンブルドクター｜ギャンブル依存症オンライン外来",
  description:
    "ギャンブル依存症専門のオンライン外来。匿名相談から予約まで、浦江晋平医師がオンラインで伴走します。",
  metadataBase: new URL("https://example.com")
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#176B5B"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        {/* Android Chrome用 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#176B5B" />

        {/* タップハイライト無効化 */}
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="bg-white text-slate-900">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  );
}
