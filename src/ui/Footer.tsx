import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-brand-blue">お問い合わせ</h2>
            <p className="mt-2 text-sm text-slate-600">
              匿名相談・ご質問はフォームよりお寄せください。緊急時は下記連絡先へ。
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-blue">緊急時のご案内</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>・最寄りの保健所・精神保健福祉センター</li>
              <li>・ギャンブル依存症ホットライン（全国）</li>
              <li>・救急の場合は 119 番へ</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-blue">法務情報</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>
                <Link href="/legal" className="hover:underline">
                  プライバシーポリシー / 利用規約
                </Link>
              </li>
              <li>
                <Link href="/legal#telemedicine" className="hover:underline">
                  オンライン診療に関する同意
                </Link>
              </li>
              <li>
                <Link href="/legal#commerce" className="hover:underline">
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} ギャンブルドクター. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
