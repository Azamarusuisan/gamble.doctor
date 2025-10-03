"use client";

import Link from "next/link";
import { Section } from "@/ui/Section";
import { CalendarCheck, MessageSquare, Video, Building2 } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "診療受付",
    description: "カレンダーから希望日時を選択して予約",
    Icon: CalendarCheck
  },
  {
    number: 2,
    title: "お呼び出し",
    description: "必要情報を登録後、SMSでお呼び出し",
    Icon: MessageSquare
  },
  {
    number: 3,
    title: "オンライン診療",
    description: "ビデオ通話で医師の診療を受診",
    Icon: Video
  },
  {
    number: 4,
    title: "お薬の受け取り/お支払い",
    description: "処方薬の受け取りとお支払い",
    Icon: Building2
  }
];

export default function FlowPage() {
  return (
    <Section
      title="診療の流れ"
      description="すべてオンラインで完結。専門医が最後まで伴走します。"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 矢印（最後以外） */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-24 z-0">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                    <path d="M0 12H30M30 12L20 2M30 12L20 22" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* カード */}
              <div className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 h-full flex flex-col">
                {/* 大きな番号 */}
                <div className="text-7xl font-bold text-slate-100 absolute top-4 right-6 group-hover:text-brand-primary/20 transition-colors duration-300">
                  {step.number}
                </div>

                {/* アイコン */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.Icon className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
                  </div>
                </div>

                {/* タイトル */}
                <h3 className="relative text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                {/* 説明 */}
                <p className="relative text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/book" className="btn-primary">予約する</Link>
        <Link href="/pricing" className="btn-secondary">料金を見る</Link>
      </div>
    </Section>
  );
}
