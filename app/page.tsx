import Image from "next/image";
import Link from "next/link";
import { Section } from "@/ui/Section";
import { Card } from "@/ui/Card";
import { IntegratedInquiryForm } from "./(public)/components/IntegratedInquiryForm";

const flowSteps = [
  {
    title: "匿名相談",
    description: "フォームから状況を共有。48時間以内に専門スタッフが返信します。"
  },
  {
    title: "オンライン問診",
    description: "ご本人・ご家族の状況をヒアリング。受診可否と方針を整理します。"
  },
  {
    title: "初診・再診",
    description: "専門医が診察。回復プランや支援制度も一緒に検討します。"
  },
  {
    title: "支援計画",
    description: "金融機関・家族会・専門機関との連携プランを提示。必要に応じ専門職を紹介。"
  },
  {
    title: "継続フォロー",
    description: "再発防止のための面談・オンラインプログラムを伴走します。"
  }
];

const faqHighlights = [
  {
    question: "初診までに必要な準備は？",
    answer: "ご本人確認書類、健康保険証（任意）、直近の生活状況がわかるメモをご準備ください。"
  },
  {
    question: "本人が受診を嫌がっています。",
    answer: "ご家族のみの相談でも可能です。家族支援プログラムをご案内します。"
  },
  {
    question: "費用の目安を教えてください。",
    answer: "初診 8,800 円、再診 5,500 円を目安にしています（デモ環境）。"
  }
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative bg-slate-900 text-white bg-[url('/images/team-hero.jpg')] bg-cover bg-center">
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-slate-900/40" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 md:px-8 md:py-28 lg:px-12">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
              ギャンブル依存症オンライン外来
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.02em' }}>
              ご本人もご家族も、<br />オンラインで<br className="md:hidden" />受診・相談できる<br />専門外来
            </h1>
            <p className="mt-8 text-[18px] leading-8 text-white/90 max-w-xl">
              ギャンブル依存症に特化したオンライン診療サービスです。
              匿名相談から予約、セルフチェック、お支払いまで、
              すべてを一連の流れで完了できます。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-slate-900 transition-all duration-200 hover:bg-gray-100 hover:scale-[0.98] shadow-lg">
                予約する
              </Link>
              <Link href="/family" className="inline-flex items-center justify-center rounded-full border-2 border-white/60 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white hover:scale-[0.98]">
                ご家族の方はまず相談
              </Link>
            </div>
            {/* 3ピル */}
            <div className="mt-12 flex flex-wrap gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span>完全匿名OK</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span>24時間予約可能</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>家族のみ相談OK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="初回相談から継続支援まで安心のオンライン完結"
        description="専門医による診療からアフターフォローまで、すべてのプロセスをオンラインで完結。プライバシーに配慮した環境で、ご自宅から一歩も出ることなく治療を受けられます。"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="専門医オンライン診療" description="専門医がオンラインで診療。全国どこからでも受診できます。" />
          <Card title="家族支援と伴走" description="専門スタッフが家族面談・金融整理・専門機関への接続をサポート。" />
          <Card title="匿名相談・セルフチェック" description="最初の一歩として匿名相談と7問のセルフチェックを用意しました。" />
        </div>
      </Section>

      <Section
        eyebrow="診療の流れ"
        title="相談からフォローアップまでの5ステップ"
        description="各ステップで必要な手続きや所要時間を事前に可視化しています。"
      >
        <div className="grid gap-4 md:grid-cols-5">
          {flowSteps.map((step) => (
            <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm">
              <h3 className="text-base font-semibold text-brand-blue">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="料金"
        title="シンプルな料金体系"
        description="デモ環境のため金額は参考値です。前払い・後払いどちらも選択できます。"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="初診 8,800円">
            <p className="leading-relaxed">診察45分 / オンライン問診付き。必要に応じてセルフチェック結果を共有します。</p>
          </Card>
          <Card title="再診 5,500円">
            <p className="leading-relaxed">診察30分。再発防止プログラムの進捗確認と今後のステップをすり合わせます。</p>
          </Card>
          <Card title="心理面接 6,600円">
            <p className="leading-relaxed">臨床心理士による面接（デモ）。家族面談・返済計画の整理にも対応します。</p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="匿名相談"
        title="匿名でも相談できます"
        description="連絡先はメールまたはSMSのどちらかで構いません。相談内容は暗号化して保存します。専門スタッフが営業日内に折り返します。（テスト環境では送信ログのみ保存）"
      >
        <IntegratedInquiryForm />
      </Section>

      <Section
        eyebrow="FAQ"
        title="よくある質問"
        description="詳細はFAQページをご覧ください。迷ったら匿名相談からどうぞ。"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {faqHighlights.map((faq) => (
            <Card key={faq.question} title={faq.question}>
              <p>{faq.answer}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="btn-secondary">
            FAQ をすべて見る
          </Link>
        </div>
      </Section>
    </div>
  );
}
