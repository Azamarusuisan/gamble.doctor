import Link from "next/link";
import { Section } from "@/ui/Section";
import { Card } from "@/ui/Card";
import { SectionZigzag } from "@/ui/SectionZigzag";
import { TicketCard } from "@/ui/TicketCard";
import { FaqTiles } from "@/ui/FaqTiles";
import { ScrollCTA } from "@/ui/ScrollCTA";
import { Stepper } from "@/ui/Stepper";
import { SymptomCarousel } from "@/ui/SymptomCarousel";
import { ScrollReveal } from "@/ui/ScrollReveal";

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
      {/* Hero Section - 背景動画＋暗幕で可読性確保 */}
      <section className="hero relative overflow-hidden py-20">
        {/* 背景動画 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/63eeaa01-dfd5-4408-b25e-69dccd6adaae.mp4" type="video/mp4" />
        </video>

        {/* 暗幕オーバーレイ: 上部35%→中間15%→下部透明で白文字の可読性を確保 */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.15) 40%, rgba(0,0,0,0) 70%)"
          }}
        ></div>

        {/* コンテンツコンテナ - z-10で暗幕より前面 */}
        <div className="container relative z-10 mx-auto max-w-screen-xl px-8 md:px-14 py-20 mt-32 md:mt-16">
          {/* 左寄せレイアウト（max-w-3xlで幅制限） */}
          <div className="max-w-3xl">
            {/* H1 - drop-shadowで背景から浮かせる */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.40)]">
              本気でギャンブルを<br />
              辞めたいあなたへ
            </h1>

            {/* サブコピー - 白85%透明度 */}
            <p className="text-base font-medium text-white/85 mt-4">
              オンライン診療サービス「ギャンブルドクター」
            </p>

            {/* 特徴カード3列 - モバイルで非表示 */}
            <div className="hidden md:grid md:grid-cols-3 gap-2 md:gap-6 space-y-2 md:space-y-0 mt-4 md:mt-6">
              {/* カード1 - モバイルで超コンパクト */}
              <div className="bg-white/85 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm md:shadow-[0_2px_8px_rgba(0,0,0,.06)] flex items-center md:flex-col md:items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-[#00AEEF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm md:text-sm font-semibold text-gray-800 leading-tight md:leading-relaxed md:text-left">
                  24時間365日 いつでも診療OK
                </p>
              </div>

              {/* カード2 */}
              <div className="bg-white/85 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm md:shadow-[0_2px_8px_rgba(0,0,0,.06)] flex items-center md:flex-col md:items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-[#00AEEF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm md:text-sm font-semibold text-gray-800 leading-tight md:leading-relaxed md:text-left">
                  完全プライバシー保護で安心
                </p>
              </div>

              {/* カード3 */}
              <div className="bg-white/85 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-6 shadow-sm md:shadow-[0_2px_8px_rgba(0,0,0,.06)] flex items-center md:flex-col md:items-start gap-2 md:gap-3">
                <svg className="w-5 h-5 md:w-8 md:h-8 text-[#00AEEF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm md:text-sm font-semibold text-gray-800 leading-tight md:leading-relaxed md:text-left">
                  専門医による丁寧な診療
                </p>
              </div>
            </div>

            {/* メインCTA - 最強の視認性: グラデーション、hover浮き上がり */}
            <div className="mt-6">
              <Link
                href="/book"
                aria-label="今すぐギャンブル依存症のオンライン診療を受ける"
                className="inline-flex items-center justify-center w-[min(420px,100%)] h-14 px-8 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#00C6FF] text-white font-semibold text-base shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
              >
                今すぐオンライン診療を受ける
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 安心帯（ヒーロー直下） */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 md:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>個人情報保護</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>当日枠あり</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>家族同席OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* 症状カルーセル */}
      <ScrollReveal>
        <SymptomCarousel />
      </ScrollReveal>

      {/* Key Features */}
      <ScrollReveal>
        <section className="section bg-slate-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="section-title">
                4つの特徴
              </h2>
              <p className="section-subtitle">
                オンライン中心で、回復までしっかりサポート
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="card bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-5">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">当日オンライン</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                当日予約OK。オンラインで全国どこからでも受診できます。
              </p>
            </div>

            <div className="card bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-5">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">専門チーム</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                専門医・心理士・SW が連携。金融整理も伴走します。
              </p>
            </div>

            <div className="card bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-5">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">家族同席可</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                ご家族のみの相談も歓迎。家族面談プログラムもあります。
              </p>
            </div>

            <div className="card bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-5">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">明瞭料金</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">
                初診8,800円、再診5,500円。前払・後払を選べます。
              </p>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <ScrollReveal>
        <SectionZigzag
        side="image-right"
        headline='"やめたい気持ち"が揺れても、仕組みで続けられる。'
        subcopy="専門医による定期診療と心理士面談、金融整理の伴走で、回復の道筋をつくります。自分一人で抱え込まなくて大丈夫です。"
        bullets={[
          "オンライン診療で全国どこからでも受診可能",
          "再発防止プログラムと継続フォロー体制",
          "家族会・専門機関との連携プランを提示"
        ]}
        iconList={[
          { icon: "", label: "専門医診療" },
          { icon: "", label: "金融整理" },
          { icon: "", label: "家族支援" }
        ]}
        ctaPrimary={{ label: "診療の流れを見る", href: "/flow" }}
        ctaSecondary={{ label: "料金を確認", href: "/pricing" }}
        image={{ src: "/images/診察.png", alt: "オンライン診療イメージ" }}
      />
      </ScrollReveal>

      {/* Pricing - 料金 */}
      <ScrollReveal>
        <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">料金プラン</h2>
            <p className="section-subtitle">
              明瞭な料金体系で、安心して治療に専念できます
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto items-stretch">
            <TicketCard
              title="初診"
              price="8,800"
              description="専門医による初回診察"
              features={[
                "オンラインビデオ通話",
                "診察時間 30-45分",
                "治療方針の相談",
                "費用・保険の説明"
              ]}
              note="前払・後払どちらも選択可能"
            />

            <TicketCard
              title="再診"
              price="5,500"
              description="継続的なフォロー診察"
              features={[
                "オンラインビデオ通話",
                "診察時間 15-30分",
                "治療進捗の確認",
                "処方箋の発行"
              ]}
              note="24時間前までキャンセル無料"
            />

            <TicketCard
              title="家族面談"
              price="6,600"
              description="ご家族のみの相談も可能"
              features={[
                "オンラインビデオ通話",
                "面談時間 30分",
                "家族支援プログラム",
                "連携機関の紹介"
              ]}
              note="初回相談は無料"
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricing" className="btn-primary">料金詳細を見る</Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">よくある質問</h2>
            <p className="section-subtitle">
              詳細はFAQページをご覧ください。お気軽にお問い合わせください。
            </p>
          </div>

          <FaqTiles items={faqHighlights} />

          <div className="mt-12 text-center">
            <Link href="/faq" className="btn-secondary">
              FAQをすべて見る
            </Link>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Sticky CTA */}
      <ScrollCTA
        primaryText="今すぐ予約"
        primaryHref="/book"
        secondaryText="料金を見る"
        secondaryHref="/pricing"
        showAfterScroll={400}
      />
    </div>
  );
}
