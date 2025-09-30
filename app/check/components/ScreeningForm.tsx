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
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question, index) => (
          <div key={question} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-brand-blue">Q{index + 1}. {question}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {choices.map((choice) => (
                <label key={choice.value} className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="radio" name={`q${index + 1}`} value={choice.value} defaultChecked={choice.value === 0} />
                  {choice.label}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "判定中..." : "結果を見る"}
        </button>
      </form>
      {error ? <p className="rounded-3xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-3xl border border-brand-teal bg-brand-light/60 p-6">
          <h3 className="text-lg font-semibold text-brand-blue">リスク判定: {result.risk}</h3>
          <p className="mt-2 text-sm text-slate-600">
            判定結果は医療行為ではありません。詳しい評価は診療時に行います。必要に応じて予約または匿名相談をご利用ください。
          </p>
          <div className="mt-4 flex gap-3">
            <a href="/book" className="btn-primary">
              予約ページへ
            </a>
            <a href="#anonymous-inquiry" className="btn-secondary">
              匿名相談フォームへ
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
