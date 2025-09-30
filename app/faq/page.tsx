"use client";

import { useMemo, useState } from "react";

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
  const [category, setCategory] = useState("すべて");

  const categories = useMemo(() => ["すべて", ...new Set(faqItems.map((item) => item.category))], []);

  const filtered = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = category === "すべて" || item.category === category;
      const matchesQuery = query
        ? item.question.includes(query) || item.answer.includes(query)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">FAQ</h1>
        <p className="section-subtitle">困ったときは匿名相談または予約ページからご連絡ください。</p>
      </div>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="キーワードで検索"
          className="md:max-w-md"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="md:w-48">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-10 space-y-4">
        {filtered.map((item) => (
          <details key={item.question} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-base font-semibold text-brand-blue">{item.question}</summary>
            <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
            <span className="mt-2 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-teal">
              {item.category}
            </span>
          </details>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-brand-teal bg-white p-6 text-sm text-slate-600">
            該当する質問が見つかりませんでした。匿名相談フォームから直接お問い合わせください。
          </p>
        ) : null}
      </div>
    </div>
  );
}
