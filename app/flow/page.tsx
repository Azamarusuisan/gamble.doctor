"use client";

import Link from "next/link";
import { Section } from "@/ui/Section";
import { CalendarCheck, MessageSquare, Video, Building2 } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "診療受付",
    description: "カレンダーから希望日時を選択して予約を行います。",
    Icon: CalendarCheck
  },
  {
    number: 2,
    title: "お呼び出し",
    description: "診療までの待ち時間に必要情報の登録をお願いします。順番になりましたらSMSでお呼び出しします。",
    Icon: MessageSquare
  },
  {
    number: 3,
    title: "オンライン診療",
    description: "ドクターとビデオ通話にてオンライン診療を行います。ドクターの指示に従って受診してください。",
    Icon: Video
  },
  {
    number: 4,
    title: "お薬の受け取り/お支払い",
    description: "診療後、クリニックより処方薬が発行されます。指定された受取方法にてお薬をお受け取りください。また、お支払い金額が確定します。",
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
        <div className="relative grid md:grid-cols-4 gap-8 pb-32">
          {/* 円環の線 */}
          <svg className="hidden md:block absolute left-0 top-0 w-full pointer-events-none" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet" style={{ zIndex: 0, height: '100%' }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#60D5EC" />
              </marker>
            </defs>
            {/* 1→2 */}
            <line x1="230" y1="100" x2="380" y2="100" stroke="#60D5EC" strokeWidth="2" strokeDasharray="8 8" markerEnd="url(#arrowhead)" className="flow-line" />
            {/* 2→3 */}
            <line x1="530" y1="100" x2="680" y2="100" stroke="#60D5EC" strokeWidth="2" strokeDasharray="8 8" markerEnd="url(#arrowhead)" className="flow-line" />
            {/* 3→4 */}
            <line x1="830" y1="100" x2="980" y2="100" stroke="#60D5EC" strokeWidth="2" strokeDasharray="8 8" markerEnd="url(#arrowhead)" className="flow-line" />
            {/* 4→1 (下を回る曲線) */}
            <path d="M 1000 130 Q 1050 130, 1050 300 Q 1050 450, 600 480 Q 150 450, 150 300 Q 150 130, 200 130" stroke="#60D5EC" strokeWidth="2" strokeDasharray="8 8" fill="none" markerEnd="url(#arrowhead)" className="flow-line" />
          </svg>

          <style jsx>{`
            @keyframes flow-line {
              0% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: -16;
              }
            }

            :global(.flow-line) {
              animation: flow-line 2s linear infinite;
            }
          `}</style>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fadeIn"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* カード */}
              <div className="relative z-10 bg-white rounded-2xl p-6 text-center flex flex-col h-full shadow-md hover:shadow-lg transition-all">
                {/* 番号 */}
                <div className="text-4xl font-bold text-sky-400 mb-3">
                  {step.number}
                </div>

                {/* アイコン */}
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                    <step.Icon className="w-10 h-10 text-brand-primary" strokeWidth={1.5} />
                  </div>
                </div>

                {/* タイトル */}
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                {/* 説明 */}
                <p className="text-xs text-slate-600 leading-relaxed">
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
