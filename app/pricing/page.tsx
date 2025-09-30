import { Section } from "@/ui/Section";
import { Card } from "@/ui/Card";

const pricing = [
  {
    title: "初診 8,800 円",
    content: [
      "オンライン診療 45 分、問診・治療方針の提示",
      "家族向け情報提供シート",
      "デモ決済のテストで前払い確認可"
    ]
  },
  {
    title: "再診 5,500 円",
    content: [
      "オンライン診療 30 分",
      "回復プログラムの進捗レビュー",
      "前払/後払どちらも対応"
    ]
  },
  {
    title: "心理面接 6,600 円",
    content: [
      "臨床心理士による個別面接",
      "家族面談・債務整理の伴走相談",
      "5 回パッケージ割引のデモ設定あり"
    ]
  }
];

const methods = ["銀行振込（予定）", "クレジットカード（デモ決済）", "後払決済（今後導入予定）"];
const policies = [
  "予約の 24 時間前までは無料でキャンセルできます。",
  "当日キャンセルは 50%（デモ環境では未請求）",
  "診療内容により保険適用の可否が変わります。詳細は診療時にご案内します。"
];

export default function PricingPage() {
  return (
    <div className="space-y-16">
      <Section title="料金プラン" description="明瞭な料金体系で、家計負担を抑えつつ治療に専念できます。">
        <div className="grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <Card key={plan.title} title={plan.title}>
              <ul className="space-y-1 text-left">
                {plan.content.map((item) => (
                  <li key={item}>・{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="支払方法" description="デモ決済は Stripe 互換のモック API で動きます。">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <ul className="space-y-2 text-left text-sm text-slate-600">
            {methods.map((method) => (
              <li key={method}>・{method}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="キャンセルポリシー" description="実装は簡易モック。将来は決済ステータス連動を予定しています。">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <ul className="space-y-2 text-left text-sm text-slate-600">
            {policies.map((policy) => (
              <li key={policy}>・{policy}</li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}
