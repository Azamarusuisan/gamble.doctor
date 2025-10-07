"use client";

import { FormEvent, useState } from "react";

const questions = [
  "日常生活でギャンブルのことが頭から離れない",
  "負けを取り戻すために金額を増やしたことがある",
  "家族や友人にギャンブルの頻度を隠したことがある",
  "ギャンブルのために借入やクレジットを利用した",
  "ギャンブルが原因で仕事・学業に影響が出た",
  "止めようと思ってもなかなか止められない",
  "ギャンブルの後に罪悪感や自己嫌悪を強く感じる"
];

const choices = [
  { value: 0, label: "ほとんどない" },
  { value: 1, label: "ときどきある" },
  { value: 2, label: "よくある" }
];

type ScreeningResult = {
  id: string;
  risk: "Low" | "Moderate" | "High";
};

export function ScreeningForm() {
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const answers: Record<string, number> = {};
    let score = 0;

    questions.forEach((question, index) => {
      const key = `q${index + 1}`;
      const value = Number(formData.get(key));
      answers[key] = value;
      score += value;
    });

    try {
      const response = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, answers, patientId: null })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "送信に失敗しました");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div key={question} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-base md:text-lg font-bold text-slate-900 mb-4">
              Q{index + 1}. {question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {choices.map((choice) => (
                <label key={choice.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name={`q${index + 1}`}
                    value={choice.value}
                    defaultChecked={choice.value === 0}
                    className="peer sr-only"
                  />
                  <div className="rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-center text-sm font-medium text-slate-700 transition-all hover:border-brand-primary hover:bg-brand-primary/5 peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-checked:text-white peer-checked:shadow-md">
                    {choice.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn-primary w-full py-4 text-base" disabled={loading}>
          {loading ? "判定中..." : "結果を見る"}
        </button>
      </form>
      {error ? <p className="rounded-3xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-3xl border border-brand-teal bg-brand-light/60 p-6">
          <h3 className="text-lg font-semibold text-brand-blue">リスク判定: {result.risk}</h3>
          <p className="mt-2 text-sm text-slate-600">
            判定結果は医療行為ではありません。詳しい評価は診療時に行います。
          </p>
          <div className="mt-4">
            <a href="/book" className="btn-primary inline-block">
              予約ページへ
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
