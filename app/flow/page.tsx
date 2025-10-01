"use client";

import Link from "next/link";
import { Section } from "@/ui/Section";
import { CalendarCheck, MessageSquare, Video, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <Section
      title="診療の流れ"
      description="すべてオンラインで完結。専門医が最後まで伴走します。"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* 進行バー */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200">
            <div
              className="w-full bg-gradient-to-b from-brand-primary to-brand-accent transition-all duration-500 ease-out"
              style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* ステップ */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                ref={(el) => { stepRefs.current[index] = el; }}
                className="relative pl-20 group"
              >
                {/* 番号バッジ */}
                <div className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  activeStep >= index
                    ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white scale-110 shadow-lg'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  <span className="text-2xl font-bold">{step.number}</span>
                </div>

                {/* カード */}
                <div className={`bg-white rounded-2xl p-8 shadow-md transition-all duration-500 ${
                  activeStep >= index
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-50 translate-x-4'
                }`}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        activeStep >= index
                          ? 'bg-gradient-to-br from-teal-50 to-cyan-50'
                          : 'bg-slate-50'
                      }`}>
                        <step.Icon className={`w-8 h-8 transition-colors duration-500 ${
                          activeStep >= index ? 'text-brand-primary' : 'text-slate-400'
                        }`} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/book" className="btn-primary">予約する</Link>
        <Link href="/pricing" className="btn-secondary">料金を見る</Link>
      </div>
    </Section>
  );
}
