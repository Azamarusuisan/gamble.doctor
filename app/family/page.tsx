"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/ui/Card";
import { Section } from "@/ui/Section";

export default function FamilyConsultationPage() {
  return (
    <div className="space-y-16 py-12">
      <Section
        eyebrow="ご家族の方へ"
        title="ご家族からの相談も承ります"
        description="ギャンブル依存症は本人だけでなく、ご家族にも大きな影響を与える問題です。一人で抱え込まず、まずはご相談ください。"
      />

      <Section
        title="こんなお悩みありませんか？"
        description="ひとつでも当てはまる場合は、専門的なサポートが必要かもしれません"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h3 className="mb-3 text-lg font-semibold">借金の発覚</h3>
            <p className="text-sm text-slate-600">
              家族に内緒で借金をしていた、督促状が届いて初めて知った
            </p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">嘘をつくようになった</h3>
            <p className="text-sm text-slate-600">
              お金の使い道について嘘をつく、仕事に行くと言って出かける
            </p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">家族関係の悪化</h3>
            <p className="text-sm text-slate-600">
              金銭問題で喧嘩が絶えない、子どもへの影響が心配
            </p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">本人が認めない</h3>
            <p className="text-sm text-slate-600">
              「いつでもやめられる」と言う、問題を指摘すると逆ギレする
            </p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">どう対応すべきか分からない</h3>
            <p className="text-sm text-slate-600">
              お金を渡すべきか、突き放すべきか、対応に悩んでいる
            </p>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">精神的に疲れ果てた</h3>
            <p className="text-sm text-slate-600">
              心配で眠れない、自分も精神的に参ってしまった
            </p>
          </Card>
        </div>
      </Section>

      <Section
        title="ご家族ができること"
        description="適切な対応により、回復への道筋をつけることができます"
      >
        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-slate-800">1. 正しい知識を身につける</h3>
              <p className="mb-4 leading-relaxed text-slate-600">
                ギャンブル依存症は「意志の弱さ」ではなく、脳の機能に関わる病気です。
                まずは病気について正しく理解することから始めましょう。
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>依存症のメカニズムを理解する</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>回復には時間がかかることを認識する</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>再発は回復過程の一部であることを理解する</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-8">
              <Image
                src="/images/family-support.svg"
                alt="家族サポートのイラスト"
                width={400}
                height={300}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8">
              <Image
                src="/images/communication.svg"
                alt="コミュニケーションのイラスト"
                width={400}
                height={300}
                className="w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="mb-4 text-2xl font-bold text-slate-800">2. 適切な境界線を設定する</h3>
              <p className="mb-4 leading-relaxed text-slate-600">
                本人の問題を肩代わりしないことが重要です。
                「助ける」と「甘やかす」の違いを理解しましょう。
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>借金の肩代わりをする</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span>嘘を見逃す、隠蔽に協力する</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>治療への参加を促す</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>回復への努力を支援する</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-slate-800">3. ご自身のケアも大切に</h3>
              <p className="mb-4 leading-relaxed text-slate-600">
                家族が疲れ果ててしまっては、適切なサポートができません。
                ご自身の心身の健康も大切にしてください。
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>家族会への参加を検討する</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>カウンセリングを受ける</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-600">✓</span>
                  <span>趣味や休息の時間を確保する</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
              <Image
                src="/images/self-care.svg"
                alt="セルフケアのイラスト"
                width={400}
                height={300}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="相談方法"
        description="まずは専門家にご相談ください"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="mb-3 text-lg font-semibold text-blue-700">オンライン相談</h3>
            <p className="mb-4 text-sm text-slate-600">
              ビデオ通話で気軽に相談できます。初回相談は30分程度です。
            </p>
            <Link href="/book" className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
              予約する
            </Link>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold text-blue-700">匿名相談</h3>
            <p className="mb-4 text-sm text-slate-600">
              お名前を伏せてメールで相談できます。1営業日以内に返信します。
            </p>
            <Link href="/#anonymous" className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700">
              匿名で相談
            </Link>
          </Card>
          <Card>
            <h3 className="mb-3 text-lg font-semibold text-purple-700">家族会</h3>
            <p className="mb-4 text-sm text-slate-600">
              同じ悩みを持つご家族と交流できます。月2回オンライン開催。
            </p>
            <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
              詳細を見る
            </button>
          </Card>
        </div>
      </Section>

      <Section
        title="料金について"
        description="ご家族の相談も保険適用となる場合があります"
      >
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">家族相談（初回）</span>
              <span className="text-xl font-bold text-blue-600">5,500円</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">家族相談（2回目以降）</span>
              <span className="text-xl font-bold text-blue-600">3,300円</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">家族会参加費</span>
              <span className="text-xl font-bold text-blue-600">無料</span>
            </div>
            <p className="text-sm text-slate-600">
              ※保険適用の可否は診察時に確認させていただきます
            </p>
          </div>
        </Card>
      </Section>

      <Section title="">
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">まずはお気軽にご相談ください</h2>
          <p className="mb-8 text-lg">
            ご家族の方の相談から治療が始まるケースも多くあります。<br />
            一人で悩まず、専門家と一緒に解決策を探しましょう。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-100"
            >
              今すぐ予約する
            </Link>
            <Link
              href="/#anonymous"
              className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-blue-600"
            >
              匿名で相談する
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}