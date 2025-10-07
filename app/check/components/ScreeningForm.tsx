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
    <div className="space-y-5 md:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {questions.map((question, index) => (
          <div key={question} className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-5 md:p-8 shadow-sm">
            <p className="text-base md:text-lg font-bold text-slate-900 mb-4 md:mb-5 leading-relaxed">
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
                  <div className="rounded-xl border-2 border-slate-200 bg-white px-4 py-4 min-h-[52px] md:min-h-[48px] flex items-center justify-center text-center text-sm md:text-base font-medium text-slate-700 transition-all duration-200 active:scale-95 hover:border-brand-primary hover:bg-brand-primary/5 peer-checked:border-brand-primary peer-checked:bg-brand-primary peer-checked:text-white peer-checked:shadow-md">
                    {choice.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="btn-primary w-full py-4 md:py-5 text-base md:text-lg font-semibold rounded-2xl md:rounded-3xl transition-all duration-200 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "判定中..." : "結果を見る"}
        </button>
      </form>
      {error ? <p className="rounded-2xl md:rounded-3xl bg-red-100 px-5 py-4 text-sm md:text-base text-red-600 leading-relaxed">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl md:rounded-3xl border border-brand-teal bg-brand-light/60 p-5 md:p-8 shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-brand-blue mb-4 md:mb-5 leading-tight">
            {result.risk === "Low" && "問題なし"}
            {result.risk === "Moderate" && "注意が必要です"}
            {result.risk === "High" && "専門家への相談を推奨します"}
          </h3>
          <div className="space-y-3 md:space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
            {result.risk === "Low" && (
              <>
                <p>現時点では深刻な問題は見られません。</p>
                <p>ただし、ギャンブルは適度に楽しみ、生活に支障が出ないよう心がけましょう。</p>
              </>
            )}
            {result.risk === "Moderate" && (
              <>
                <p>一部の項目で注意が必要なサインが見られます。</p>
                <p>ギャンブルとの付き合い方を見直し、セルフケアを心がけることをお勧めします。</p>
                <p className="font-semibold">不安がある場合は、専門家に相談することをご検討ください。</p>
              </>
            )}
            {result.risk === "High" && (
              <>
                <p className="font-bold text-red-600 text-base md:text-lg">ギャンブル依存症の可能性があります。</p>
                <p>一人で抱え込まず、できるだけ早く専門家に相談することを強くお勧めします。</p>
                <p>当クリニックでは、安心して相談できる環境を整えています。</p>
              </>
            )}
          </div>
          <p className="mt-4 md:mt-5 text-xs md:text-sm text-slate-500 border-t border-slate-200 pt-3 md:pt-4 leading-relaxed">
            ※ この判定結果は医療行為ではありません。詳しい評価は診療時に行います。
          </p>
          <div className="mt-5 md:mt-6">
            <a href="/book" className="btn-primary inline-block w-full text-center py-4 md:py-5 text-base md:text-lg font-semibold rounded-2xl md:rounded-3xl transition-all duration-200 active:scale-98">
              オンライン診療を予約する
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
