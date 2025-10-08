import Link from "next/link";
import { Section } from "@/ui/Section";
import { ScrollReveal } from "@/ui/ScrollReveal";

export default function DoctorsPage() {
  return (
    <div>
      <ScrollReveal>
        <Section
          title="ギャンブルドクターとは"
          description="ギャンブル依存症に悩む方とご家族のための、オンライン診療サービスです。"
        >
          <div className="space-y-12">
          {/* サービス概要 */}
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              ギャンブルドクターは、ギャンブル依存症の治療を専門とするオンライン診療サービスです。
              「やめたいけどやめられない」「家族がギャンブルにのめり込んでいる」そんな悩みを抱える方に、
              専門医による診療と継続的なサポートを提供します。
            </p>
          </div>

          {/* こんな方におすすめ */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">こんな方におすすめです</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#00AEEF] mb-3">ご本人の方</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>・ギャンブルをやめたいけど、一人では難しい</li>
                  <li>・借金が増えて、生活が苦しい</li>
                  <li>・家族や仕事に悪影響が出ている</li>
                  <li>・病院に行くのが恥ずかしい、時間がない</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#00AEEF] mb-3">ご家族の方</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>・家族がギャンブルにのめり込んでいる</li>
                  <li>・借金の肩代わりを繰り返してしまう</li>
                  <li>・どう接したらいいか分からない</li>
                  <li>・本人が受診を嫌がっている</li>
                </ul>
              </div>
            </div>
          </div>

          {/* サービスの特徴 */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">ギャンブルドクターの特徴</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">オンラインで完結</h3>
                <p className="text-slate-600">
                  スマホやPCがあれば、全国どこからでも受診可能。通院の手間や時間を気にせず、自宅から安心して相談できます。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">専門医による診療</h3>
                <p className="text-slate-600">
                  ギャンブル依存症の治療経験が豊富な専門医が、一人ひとりの状況に合わせた治療プランを提案します。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">家族も一緒に</h3>
                <p className="text-slate-600">
                  ご家族のみの相談も歓迎。家族支援プログラムで、依存症への理解と適切な関わり方をサポートします。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">24時間予約可能</h3>
                <p className="text-slate-600">
                  当日予約もOK。思い立ったときにすぐ予約できるので、「やめたい」という気持ちを逃しません。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">プライバシー保護</h3>
                <p className="text-slate-600">
                  完全匿名での相談も可能。個人情報は厳重に管理され、安心して治療に専念できます。
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00AEEF]/10 text-[#00AEEF] mb-4">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">継続サポート</h3>
                <p className="text-slate-600">
                  再発防止プログラムと定期的なフォローアップで、回復への道のりを長期的に支援します。
                </p>
              </div>
            </div>
          </div>

          {/* 治療の流れ */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">まずは相談から始めましょう</h2>
            <p className="text-center text-slate-700 mb-8">
              ギャンブル依存症は、適切な治療とサポートで回復できる病気です。<br />
              一人で悩まず、まずはお気軽にご相談ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#00C6FF] px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                今すぐオンライン診療を予約
              </Link>
              <Link
                href="/flow"
                className="inline-flex items-center justify-center rounded-full bg-white border-2 border-[#00AEEF] px-8 py-4 text-base font-semibold text-[#00AEEF] transition-all hover:bg-blue-50"
              >
                診療の流れを見る
              </Link>
            </div>
          </div>
        </div>
      </Section>
      </ScrollReveal>
    </div>
  );
}
