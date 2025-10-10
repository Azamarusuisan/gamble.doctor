"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/flow", label: "診療の流れ" },
  { href: "/pricing", label: "料金" },
  { href: "/doctors", label: "サービスの紹介" },
  { href: "/faq", label: "FAQ" }
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-32 max-w-screen-xl items-center justify-between px-8 md:px-14">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/ギャンブルドクター.jpg"
            alt="ギャンブルドクター - オンライン診療"
            width={400}
            height={111}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* デスクトップナビゲーション */}
        <nav className="hidden space-x-10 font-medium text-[#1E355A] md:flex" style={{ fontSize: '1.25rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "px-4 relative transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 rounded",
                pathname === item.href && "font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* デスクトップCTA */}
        <Link
          href="/book"
          aria-label="オンライン診療を予約する"
          className="hidden md:flex items-center rounded-full bg-[#00AEEF] px-6 py-2.5 font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:ring-offset-2 -translate-y-1"
          style={{ fontSize: '1rem' }}
        >
          予約する
        </Link>

        {/* モバイルハンバーガーメニュー */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-[#00B7FF] transition"
          aria-label="メニュー"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur animate-fade-in">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "px-6 py-3 text-base font-medium transition hover:bg-blue-50",
                  pathname === item.href ? "text-[#00B7FF] bg-blue-50" : "text-slate-700"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-6 pt-4 pb-2">
              <Link
                href="/book"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-xl bg-[#00B7FF] px-4 py-3 text-center text-base font-semibold text-white shadow-sm hover:bg-[#00A0E8]"
              >
                予約する
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
