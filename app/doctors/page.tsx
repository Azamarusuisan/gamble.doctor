import Image from "next/image";
import { Section } from "@/ui/Section";

const credentials = [
  "精神科専門医（仮）",
  "依存症治療プログラム監修",
  "家族支援カウンセラー研修修了",
  "オンライン診療ガイドライン準拠の診察経験"
];

export default function DoctorsPage() {
  return (
    <Section
      title="浦江晋平 医師"
      description="ギャンブル依存症治療に特化した専門医がオンラインで伴走します。"
    >
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <Image
            src="/images/医者.png"
            alt="浦江晋平医師のサンプル画像"
            width={420}
            height={420}
            className="h-auto w-full rounded-3xl shadow object-cover"
          />
          <p className="text-sm text-slate-600">
            ※サンプル画像です
          </p>
        </div>
        <div className="space-y-6 text-left text-sm text-slate-600">
          <p>
            浦江晋平は、ギャンブル依存症および行動嗜癖の診療経験を持つ精神科医です。本人・ご家族双方の支援に加え、債務・法律・福祉資源との連携を重視した治療プログラムを提供します。
          </p>
          <div>
            <h3 className="text-base font-semibold text-brand-blue">専門領域</h3>
            <ul className="mt-2 space-y-1">
              <li>・ギャンブル依存症の診断・治療</li>
              <li>・アルコール・ゲーム依存症の初期介入</li>
              <li>・家族支援プログラム設計</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-brand-blue">略歴（仮）</h3>
            <ul className="mt-2 space-y-1">
              {credentials.map((item) => (
                <li key={item}>・{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-brand-blue">メッセージ</h3>
            <p className="mt-2">
              「依存症は回復できる疾患です。早期の相談と、家族を含めたチーム支援が鍵になります。オンラインの強みを生かし、全国どこからでも気軽にアクセスできる外来を目指します。」
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
