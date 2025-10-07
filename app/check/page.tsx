import Image from "next/image";
import { Section } from "@/ui/Section";
import { ScreeningForm } from "./components/ScreeningForm";

export default function CheckPage() {
  return (
    <Section
      title="セルフチェック"
      description="7 つの質問に回答すると、ギャンブル問題のリスクを簡易判定できます。点数は診療まで安全に保管されます。"
    >
      <div className="flex flex-col gap-6 md:gap-10 md:grid md:grid-cols-[2fr_1fr]">
        {/* モバイル：スコア目安を上部に配置 */}
        <div className="md:hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-brand-blue">スコアの目安</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">●</span>
              <span><strong>0〜7点:</strong> 問題なし</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">●</span>
              <span><strong>8〜14点:</strong> 注意が必要</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">●</span>
              <span><strong>15〜21点:</strong> 専門家への相談を推奨</span>
            </li>
          </ul>
        </div>

        <ScreeningForm />

        {/* デスクトップ：サイドバーとして右側に配置 */}
        <div className="hidden md:block space-y-6 text-sm text-slate-600">
          <Image
            src="/images/survey-hand.svg"
            alt="セルフチェックを表現した抽象イラスト"
            width={420}
            height={240}
            className="h-auto w-full rounded-3xl shadow"
          />
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-brand-blue">スコアの目安</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">●</span>
                <span><strong>0〜7点:</strong> 問題なし</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">●</span>
                <span><strong>8〜14点:</strong> 注意が必要</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">●</span>
                <span><strong>15〜21点:</strong> 専門家への相談を推奨</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
