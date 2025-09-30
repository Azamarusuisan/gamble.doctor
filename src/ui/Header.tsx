"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/flow", label: "診療の流れ" },
  { href: "/pricing", label: "料金" },
  { href: "/doctors", label: "医師紹介" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "予約" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-brand-blue">
          ギャンブルドクター
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative transition hover:text-brand-blue",
                pathname === item.href && "text-brand-blue"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/book"
          className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue"
        >
          ご家族へ：まず相談
        </Link>
      </div>
    </header>
  );
}
