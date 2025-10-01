"use client";

import { useState } from "react";
import * as HeroIcons from "@heroicons/react/24/outline";

interface FlowCardProps {
  step: number;
  title: string;
  duration: string;
  icon: string;
  points: string[];
  prep: string[];
  isLast?: boolean;
}

export function FlowCard({ step, title, duration, icon, points, prep, isLast = false }: FlowCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Heroiconsからアイコンを動的に取得
  const IconComponent = (HeroIcons as any)[icon] || HeroIcons.QuestionMarkCircleIcon;

  return (
    <>
      {/* モバイル: アコーディオン */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all duration-200 hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
          aria-expanded={isOpen}
          aria-label={`ステップ${step}: ${title}の詳細を${isOpen ? '閉じる' : '開く'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg">
                {step}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded-full">
                  {duration}
                </span>
              </div>
            </div>
            <svg
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">内容</h4>
                <ul className="space-y-2">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">準備物</h4>
                <div className="flex flex-wrap gap-2">
                  {prep.map((item, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* デスクトップ: カード */}
      <div className="hidden md:block">
        <div className="relative flex flex-col h-full min-w-[320px] max-w-[360px] rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary">
          {/* ステップバッジ */}
          <div className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-lg shadow-md">
            {step}
          </div>

          {/* アイコン */}
          <div className="mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <IconComponent className="h-8 w-8" aria-hidden="true" />
          </div>

          {/* タイトル & 所要時間 */}
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
          <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-brand-primary/10 text-brand-primary rounded-full self-start">
            {duration}
          </span>

          {/* ポイント */}
          <div className="mb-6 flex-grow">
            <ul className="space-y-3">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <svg className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 準備物 */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2">準備物</p>
            <div className="flex flex-wrap gap-2">
              {prep.map((item, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 接続線（最後のカード以外） */}
          {!isLast && (
            <div className="hidden xl:block absolute top-1/2 -right-8 w-8 h-px bg-slate-300" aria-hidden="true">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-primary" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}