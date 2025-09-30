"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ScrollCTAProps {
  primaryText: string;
  primaryHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  showAfterScroll?: number; // px scrolled before showing
}

export function ScrollCTA({
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
  showAfterScroll = 300
}: ScrollCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-medium text-slate-900">
              匿名相談・予約はこちら
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              48時間以内に専門スタッフが返信します
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            {secondaryText && secondaryHref && (
              <Link href={secondaryHref} className="btn-ghost text-sm px-4 py-2">
                {secondaryText}
              </Link>
            )}
            <Link href={primaryHref} className="btn-primary text-sm px-5 py-2">
              {primaryText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}