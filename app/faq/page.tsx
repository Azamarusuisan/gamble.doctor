"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  // カテゴリごとにグループ化
  const groupedByCategory = useMemo(() => {
    const filtered = faqItems.filter((item) => {
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
  }, [query]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">FAQ</h1>
        <p className="section-subtitle">困ったときは匿名相談または予約ページからご連絡ください。</p>
      </div>

      <div className="mt-8">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="キーワードで検索"
          className="w-full"
        />
      </div>

      <div className="mt-10 space-y-4">
        {groupedByCategory.map(([category, items]) => {
          const isCategoryOpen = openCategories.has(category);

          return (
            <div key={category} className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* カテゴリヘッダー */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-all duration-200 hover:bg-slate-50 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block rounded-full bg-brand-light px-3 py-1 text-xs md:text-sm font-semibold text-brand-teal">
                    {category}
                  </span>
                  <span className="text-sm text-slate-500">
                    {items.length}件
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 md:w-6 md:h-6 text-brand-teal transition-transform duration-300 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* カテゴリ配下の質問リスト */}
              {isCategoryOpen && (
                <div className="border-t border-slate-100">
                  {items.map((item, index) => {
                    const isQuestionOpen = openQuestions.has(item.question);

                    return (
                      <div
                        key={item.question}
                        className={`${index !== 0 ? "border-t border-slate-100" : ""}`}
                      >
                        {/* 質問 */}
                        <button
                          onClick={() => toggleQuestion(item.question)}
                          className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left transition-all duration-200 hover:bg-slate-50 active:scale-[0.99]"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-brand-primary font-bold text-lg md:text-xl flex-shrink-0 mt-0.5">
                              Q
                            </span>
                            <span className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
                              {item.question}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 mt-1 ${
                              isQuestionOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* 回答 */}
                        {isQuestionOpen && (
                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                            <div className="flex items-start gap-3 bg-brand-light/30 rounded-xl p-4 md:p-5">
                              <span className="text-brand-teal font-bold text-lg md:text-xl flex-shrink-0">
                                A
                              </span>
                              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {groupedByCategory.length === 0 && (
        <p className="mt-10 rounded-2xl md:rounded-3xl border border-dashed border-brand-teal bg-white p-6 text-sm md:text-base text-slate-600 text-center">
          該当する質問が見つかりませんでした。匿名相談フォームから直接お問い合わせください。
        </p>
      )}
    </div>
  );
}
