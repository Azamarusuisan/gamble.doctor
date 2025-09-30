import { Section } from "@/ui/Section";

const sections = [
  {
    id: "privacy",
    title: "プライバシーポリシー (雛形)",
    body: [
      "取得する個人情報：氏名、連絡先、相談内容、診療記録、決済情報（デモ）",
      "利用目的：オンライン診療の提供、本人確認、サポート体制の構築",
      "第三者提供：原則として行いません。緊急時または法令に基づく場合を除きます。",
      "安全管理：通信の暗号化、アクセス制限、監査ログの保存"
    ]
  },
  {
    id: "terms",
    title: "利用規約 (雛形)",
    body: [
      "サービス内容：ギャンブル依存症に関するオンライン診療および相談",
      "禁止事項：虚偽の申告、不適切な言動、他者へのなりすまし",
      "免責事項：デモ環境のため診療・決済は仮想的に実施します",
      "準拠法：日本法"
    ]
  },
  {
    id: "telemedicine",
    title: "オンライン診療同意書 (雛形)",
    body: [
      "オンライン診療は対面診療とは異なる特性があり、通信環境の影響を受けることがあります。",
      "診療内容に応じ対面受診をお願いする場合があります。",
      "緊急時の連絡先（保健所・救急）の確認をお願いします。"
    ]
  },
  {
    id: "commerce",
    title: "特定商取引法に基づく表記 (雛形)",
    body: [
      "事業者名：ギャンブルドクター（仮）",
      "責任者：浦江晋平",
      "所在地：オンライン専用のため準備中",
      "販売価格：料金ページ参照（すべて税込表示）",
      "代金の支払時期・方法：デモ決済（カード）／銀行振込予定",
      "キャンセル・返金：キャンセルポリシーに準じます"
    ]
  }
];

export default function LegalPage() {
  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ul className="space-y-2 text-sm text-slate-600">
              {section.body.map((item) => (
                <li key={item}>・{item}</li>
              ))}
            </ul>
          </div>
        </Section>
      ))}
    </div>
  );
}
