"use client";

const symptoms = [
  "より強い興奮を得るために、掛け金を増やす必要がある",
  "賭博を減らしたり止めようとすると、落ち着かない、いらだちを感じる",
  "賭博を抑える、減らす、止めようとしても繰り返し挫折する",
  "賭博に関する思考・計画・準備にふける（次回戦略を練る）",
  "ストレス解消、気晴らし、または逃避として賭博を使う",
  "負けた後、取り戻すためにさらに賭ける（追賭）",
  "家族・他人に賭博の程度を隠すために嘘をつく",
  "賭博のために人間関係、仕事、教育、キャリア等を犠牲にする",
  "経済的な窮地を脱するため、他人に金銭の援助を求める"
];

export function SymptomCarousel() {
  // 症状を3回繰り返して無限ループ効果を作る
  const repeatedSymptoms = [...symptoms, ...symptoms, ...symptoms];

  return (
    <section className="bg-white py-12 overflow-hidden border-b border-slate-200">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            こんな症状でお悩みではありませんか？
          </h2>
          <p className="text-sm text-slate-600">
            これらの症状がある方は、専門医による診療をおすすめします
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-6 animate-scroll">
            {repeatedSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 px-8 py-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="text-lg font-medium text-slate-800 text-center whitespace-normal">
                  {symptom}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/book"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-medium rounded-xl transition-all duration-200 hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shadow-lg"
          >
            診療を予約する
          </a>
          <a
            href="/check"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
          >
            セルフチェック
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-320px * ${symptoms.length} - 24px * ${symptoms.length}));
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
