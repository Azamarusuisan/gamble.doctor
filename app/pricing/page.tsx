import { Section } from "@/ui/Section";

const pricing = [
  {
    title: "初診",
    price: "8,800",
    duration: "45分",
    popular: false,
    features: [
      "オンライン診療",
      "問診・治療方針の提示",
      "家族向け情報提供シート",
      "デモ決済のテストで前払い確認可"
    ]
  },
  {
    title: "再診",
    price: "5,500",
    duration: "30分",
    popular: false,
    features: [
      "オンライン診療",
      "回復プログラムの進捗レビュー",
      "前払/後払どちらも対応",
      "継続サポート"
    ]
  },
  {
    title: "心理面接",
    price: "6,600",
    duration: "50分",
    popular: false,
    features: [
      "臨床心理士による個別面接",
      "家族面談・債務整理の伴走相談",
      "5回パッケージ割引あり",
      "専門的アプローチ"
    ]
  }
];

const methods = [
  { name: "クレジットカード", note: "デモ決済対応" },
  { name: "銀行振込", note: "予定" },
  { name: "後払決済", note: "今後導入予定" }
];

const policies = [
  { icon: "✓", text: "予約の24時間前までは無料でキャンセル可能" },
  { icon: "⚠️", text: "当日キャンセルは50%（デモ環境では未請求）" },
  { icon: "ℹ️", text: "診療内容により保険適用の可否が変わります" }
];

export default function PricingPage() {
  return (
    <div>
      <Section title="料金プラン" description="明瞭な料金体系で、家計負担を抑えつつ治療に専念できます。">
        <div className="grid gap-8 md:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.title}
              className={`relative rounded-3xl border-2 bg-white p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular
                  ? 'border-brand-teal shadow-lg'
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-brand-teal px-4 py-1.5 text-sm font-semibold text-white shadow-md">
                    人気プラン
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-brand-teal">¥{plan.price}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{plan.duration}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-brand-accent mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/book"
                className={`block w-full rounded-full py-4 font-semibold text-center transition-all duration-200 ${
                  plan.popular
                    ? 'bg-brand-teal text-white hover:bg-emerald-600 hover:scale-[0.98] shadow-sm'
                    : 'border-2 border-slate-200 text-slate-700 hover:border-brand-teal hover:text-brand-teal hover:scale-[0.98]'
                }`}
              >
                予約する
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* 比較表 */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">プラン比較</h2>
          <p className="text-[17px] text-slate-600">各プランの詳細な比較です</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-3xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">項目</th>
                {pricing.map((plan) => (
                  <th key={plan.title} className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                    {plan.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm text-slate-600">診療時間</td>
                {pricing.map((plan) => (
                  <td key={plan.title} className="px-6 py-4 text-center text-sm text-slate-900 font-semibold">
                    {plan.duration}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/50">
                <td className="px-6 py-4 text-sm text-slate-600">料金</td>
                {pricing.map((plan) => (
                  <td key={plan.title} className="px-6 py-4 text-center text-sm text-brand-teal font-bold">
                    ¥{plan.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-slate-600">オンライン対応</td>
                {pricing.map((plan) => (
                  <td key={plan.title} className="px-6 py-4 text-center">
                    <span className="text-brand-accent text-lg">✓</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Section title="支払方法" description="デモ決済はStripe互換のモックAPIで動きます。">
        <div className="grid gap-6 md:grid-cols-3">
          {methods.map((method) => (
            <div key={method.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{method.name}</h3>
              <p className="text-sm text-slate-500">{method.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="キャンセルポリシー" description="実装は簡易モック。将来は決済ステータス連動を予定しています。">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
          <ul className="space-y-4">
            {policies.map((policy) => (
              <li key={policy.text} className="flex items-start gap-3">
                <span className="text-xl">{policy.icon}</span>
                <span className="text-[17px] text-slate-600 leading-8">{policy.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}
