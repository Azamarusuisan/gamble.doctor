import Image from "next/image";
import { Section } from "@/ui/Section";

const steps = [
  {
    number: 1,
    title: "匿名相談",
    duration: "15分",
    detail: "フォームで状況を共有。ご家族のみの相談もOK。",
    prep: "メールまたはSMS連絡先",
    image: "/images/診断申し込み.png"
  },
  {
    number: 2,
    title: "オンライン問診",
    duration: "30分",
    detail: "看護師・心理士がヒアリングし、流れと費用をご案内。",
    prep: "本人確認書類、健康保険証（任意）",
    image: "/images/無料相談.png?v=2"
  },
  {
    number: 3,
    title: "初診",
    duration: "45分",
    detail: "専門医が診察し、依存の段階と治療方針を提示。",
    prep: "カメラ付き端末、静かな環境",
    image: "/images/診察.png"
  },
  {
    number: 4,
    title: "支援計画",
    duration: "30分",
    detail: "行動制限・家族支援・債務整理などを組み合わせた計画を提案。",
    prep: "家計メモ、同行支援の希望（任意）",
    image: "/images/診断申し込み.png"
  },
  {
    number: 5,
    title: "フォローアップ",
    duration: "30分",
    detail: "再発予防プログラムや家族会など継続支援を実施。",
    prep: "次回予約候補",
    image: "/images/無料相談.png?v=2"
  }
];

export default function FlowPage() {
  return (
    <div>
      <Section
        title="安心の診療プロセス"
        description="初回のご相談から継続的なサポートまで、すべてオンラインで完結。専門医とスタッフが、あなたのペースに合わせて丁寧に寄り添います。"
      >
        {/* Desktop: 横並びステッパー */}
        <div className="hidden md:block">
          <div className="relative">
            {/* 繋ぐ線 */}
            <div className="absolute top-32 left-0 right-0 h-0.5 bg-slate-200 -z-10" style={{left: "10%", right: "10%"}}></div>

            <div className="flex items-start justify-between gap-4 px-4">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center flex-1 max-w-[200px]">
                  <div className="relative w-48 h-48 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-lg mb-6 transition-all duration-300 hover:border-brand-teal hover:shadow-xl hover:scale-105">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      loading="eager"
                      quality={75}
                    />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-1">{step.title}</h3>
                  <p className="text-sm text-brand-teal font-semibold mb-2">{step.duration}</p>
                  <p className="text-sm text-slate-600 text-center leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: 縦並びステッパー */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-24 bottom-0 w-0.5 bg-slate-200 -z-10"></div>
              )}
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    loading="eager"
                    quality={75}
                  />
                  <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-brand-teal font-semibold mb-2">{step.duration}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">{step.detail}</p>
                  <p className="text-xs text-slate-500">準備物: {step.prep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 詳細カード */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.number} className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal text-white flex items-center justify-center text-lg font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-brand-teal font-semibold">{step.duration}</p>
                </div>
              </div>
              <p className="text-[17px] text-slate-600 leading-8 mb-4">{step.detail}</p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">準備物:</span> {step.prep}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
