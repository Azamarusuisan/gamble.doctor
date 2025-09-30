import Image from "next/image";
import { Section } from "@/ui/Section";

const timeline = [
  {
    title: "匿名相談 (15 分)",
    detail: "フォームで状況を共有。ご家族のみの相談もOK。",
    checklist: ["準備物：メールまたは SMS 連絡先"]
  },
  {
    title: "オンライン問診 (30 分)",
    detail: "看護師・心理士がヒアリングし、流れと費用をご案内。",
    checklist: ["準備物：本人確認書類、健康保険証（任意）"]
  },
  {
    title: "初診 (45 分)",
    detail: "専門医が診察し、依存の段階と治療方針を提示。",
    checklist: ["準備物：カメラ付き端末、静かな環境"]
  },
  {
    title: "支援計画 (30 分)",
    detail: "行動制限・家族支援・債務整理などを組み合わせた計画を提案。",
    checklist: ["準備物：家計メモ、同行支援の希望（任意）"]
  },
  {
    title: "フォローアップ (30 分)",
    detail: "再発予防プログラムや家族会など継続支援を実施。",
    checklist: ["準備物：次回予約候補"]
  }
];

export default function FlowPage() {
  return (
    <div className="space-y-16">
      <Section
        title=""
        description="初回のご相談から継続的なサポートまで、すべてオンラインで完結。専門医とスタッフが、あなたのペースに合わせて丁寧に寄り添います。"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-center text-brand-blue mb-4">安心の診療プロセス</h2>
        <div>
          <div className="mb-16 flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-between relative px-8">
                {/* 繋ぐ線 */}
                <div className="absolute top-24 left-0 right-0 h-1 bg-brand-teal/30 -z-10" style={{left: "18%", right: "18%"}}></div>

                {/* ステップ1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-48 h-48 rounded-full bg-white border-4 border-brand-teal flex items-center justify-center overflow-hidden shadow-lg mb-4">
                    <Image
                      src="/images/診断申し込み.png"
                      alt="サイトからお申し込み"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      loading="eager"
                      quality={75}
                    />
                  </div>
                  <p className="text-base font-semibold text-brand-blue text-center h-12 flex items-center justify-center">
                    サイトから<br />お申し込み
                  </p>
                </div>

                {/* ステップ2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-48 h-48 rounded-full bg-white border-4 border-brand-teal flex items-center justify-center overflow-hidden shadow-lg mb-4">
                    <Image
                      src="/images/無料相談.png?v=2"
                      alt="無料相談"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      loading="eager"
                      quality={75}
                    />
                  </div>
                  <p className="text-base font-semibold text-brand-blue text-center h-12 flex items-center justify-center">
                    無料相談
                  </p>
                </div>

                {/* ステップ3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-48 h-48 rounded-full bg-white border-4 border-brand-teal flex items-center justify-center overflow-hidden shadow-lg mb-4">
                    <Image
                      src="/images/診察.png"
                      alt="診療開始"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      loading="eager"
                      quality={75}
                    />
                  </div>
                  <p className="text-base font-semibold text-brand-blue text-center h-12 flex items-center justify-center">
                    診療開始
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-6 top-10 hidden h-full border-l border-dashed border-brand-teal md:block" />
            <ol className="relative space-y-10">
              {timeline.map((step, index) => (
                <li key={step.title} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-sm font-semibold text-brand-blue">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-blue">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{step.detail}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm text-slate-500">
                    {step.checklist.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </div>
  );
}
