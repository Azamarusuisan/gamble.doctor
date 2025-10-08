"use client";

import { useMemo, useState } from "react";
import { Dropdown } from "@/ui/Dropdown";
import { ScrollReveal } from "@/ui/ScrollReveal";

const faqItems = [
  {
    category: "初診前",
    question: "匿名相談だけでも対応してもらえますか？",
    answer: "はい。匿名相談フォームから状況をご記入いただければ、担当スタッフが連絡方法に沿ってご返信します。"
  },
  {
    category: "初診前",
    question: "本人が同席できない場合でも初診できますか？",
    answer: "家族のみでの初期相談が可能です。診療が必要な場合は本人の同意を確認してから進めます。"
  },
  {
    category: "料金・決済",
    question: "デモ決済とは何ですか？",
    answer: "クレジットカード決済を模したモック API です。実際の請求は発生しません。"
  },
  {
    category: "料金・決済",
    question: "保険診療には対応していますか？",
    answer: "デモ環境のため未対応です。本番導入時に診療報酬請求フローを整備します。"
  },
  {
    category: "セルフチェック",
    question: "セルフチェックの結果はどこに保存されますか？",
    answer: "Prisma の SQLite データベースに保存し、リスク判定（Low/Moderate/High）を返します。"
  },
  {
    category: "管理画面",
    question: "管理画面の認証はどうなっていますか？",
    answer: "簡易セッションで保護しています。NextAuth や MFA は本番導入時に追加予定です。"
  }
];

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // カテゴリ一覧を取得
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(faqItems.map((item) => item.category)));
    return [
      { value: "all", label: "すべてのカテゴリ" },
      ...uniqueCategories.map((cat) => ({ value: cat, label: cat }))
    ];
  }, []);

  // カテゴリごとにグループ化
  const groupedByCategory = useMemo(() => {
    const filtered = faqItems.filter((item) => {
      // カテゴリフィルター
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // キーワード検索
      if (!query) return true;
      return item.question.includes(query) || item.answer.includes(query) || item.category.includes(query);
    });

    const groups = new Map<string, typeof faqItems>();
    filtered.forEach((item) => {
      if (!groups.has(item.category)) {
        groups.set(item.category, []);
      }
      groups.get(item.category)!.push(item);
    });

    return Array.from(groups.entries());
  }, [query, selectedCategory]);


  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">FAQ</h1>
        <p className="section-subtitle">困ったときは匿名相談または予約ページからご連絡ください。</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Dropdown
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            label="カテゴリで絞り込み"
            placeholder="すべてのカテゴリ"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              キーワード検索
            </label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="キーワードで検索"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm md:text-base shadow-sm transition-all duration-200 hover:border-brand-teal focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {groupedByCategory.map(([category, items]) => (
          <ScrollReveal key={category}>
            <div className="space-y-6">
            {/* カテゴリヘッダー */}
            <div className="flex items-center gap-3 pb-3 border-b-2 border-brand-teal">
              <span className="inline-block rounded-full bg-brand-light px-4 py-1.5 text-sm md:text-base font-semibold text-brand-teal">
                {category}
              </span>
              <span className="text-sm text-slate-500">
                {items.length}件
              </span>
            </div>

            {/* 質問リスト */}
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-6"
                >
                  {/* 質問 */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-brand-primary font-bold text-lg md:text-xl flex-shrink-0 mt-0.5">
                      Q
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
                      {item.question}
                    </h3>
                  </div>

                  {/* 回答 */}
                  <div className="flex items-start gap-3 bg-brand-light/30 rounded-xl p-4 md:p-5">
                    <span className="text-brand-teal font-bold text-lg md:text-xl flex-shrink-0">
                      A
                    </span>
                    <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>

      {groupedByCategory.length === 0 && (
        <p className="mt-10 rounded-2xl md:rounded-3xl border border-dashed border-brand-teal bg-white p-6 text-sm md:text-base text-slate-600 text-center">
          該当する質問が見つかりませんでした。匿名相談フォームから直接お問い合わせください。
        </p>
      )}
    </div>
  );
}
