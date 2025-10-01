"use client";

import Link from "next/link";
import { FlowCard } from "./FlowCard";
import { FlowCurve } from "./FlowCurve";
import { FLOW_STEPS } from "../../data/flow";

export function FlowSection() {
  return (
    <section className="section bg-slate-50 relative overflow-hidden">
      {/* 背景曲線（PC only） */}
      <div className="hidden md:block absolute inset-0">
        <FlowCurve />
      </div>

      <div className="container relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="section-title">安心の診療プロセス</h2>
          <p className="section-subtitle leading-relaxed">
            初回のご相談から継続サポートまで、すべてオンラインで完結。専門医とスタッフが、あなたのペースに合わせて丁寧に伴走します。
          </p>
        </div>

        {/* モバイル: 縦アコーディオン */}
        <div className="md:hidden space-y-4 mb-12">
          {FLOW_STEPS.map((step, index) => (
            <FlowCard
              key={step.step}
              {...step}
              isLast={index === FLOW_STEPS.length - 1}
            />
          ))}
        </div>

        {/* デスクトップ: 横スクロールタイムライン */}
        <div className="hidden md:block mb-12">
          <div className="overflow-x-auto pb-8 -mx-4 px-4">
            <div className="flex gap-8 min-w-min px-4">
              {FLOW_STEPS.map((step, index) => (
                <FlowCard
                  key={step.step}
                  {...step}
                  isLast={index === FLOW_STEPS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA: 途中 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl transition-all duration-200 hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shadow-lg"
          >
            予約する
          </Link>
          <Link
            href="/book#inquiry"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-900 font-semibold rounded-xl transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
          >
            匿名相談
          </Link>
        </div>

        {/* 補足説明 */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 leading-relaxed">
              ※ 所要時間は目安です。症状や状況により前後する場合があります。<br />
              ※ 緊急時は119番または最寄りの医療機関をご利用ください。
            </p>
          </div>
        </div>

        {/* CTA: 最後 */}
        <div className="mt-12 text-center">
          <Link
            href="/flow"
            className="inline-flex items-center justify-center px-6 py-3 text-brand-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg"
          >
            詳しい流れを見る
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}