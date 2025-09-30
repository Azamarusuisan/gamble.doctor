import Image from "next/image";
import { Section } from "@/ui/Section";
import { ScreeningForm } from "./components/ScreeningForm";

export default function CheckPage() {
  return (
    <Section
      title="セルフチェック"
      description="7 つの質問に回答すると、ギャンブル問題のリスクを簡易判定できます。点数は診療まで安全に保管されます。"
    >
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <ScreeningForm />
        <div className="space-y-6 text-sm text-slate-600">
          <Image
            src="/images/survey-hand.svg"
            alt="セルフチェックを表現した抽象イラスト"
            width={420}
            height={240}
            className="h-auto w-full rounded-3xl shadow"
          />
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-brand-blue">スコアの目安</h3>
            <ul className="mt-3 space-y-1">
              <li>・0〜3点: Low（課題の可能性は低め）</li>
              <li>・4〜7点: Moderate（相談に進むことを推奨）</li>
              <li>・8〜14点: High（専門家への相談が必要）</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
