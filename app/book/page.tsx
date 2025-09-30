import Image from "next/image";
import { BookingWidget } from "./components/BookingWidget";
import { Section } from "@/ui/Section";

export default function BookPage() {
  return (
    <Section
      title="オンライン予約"
      description="カレンダーから枠を選び、情報を入力するだけで仮予約まで完了します。デモ環境のため決済は実際には行われません。"
    >
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <BookingWidget />
        <div className="space-y-6 text-sm text-slate-600">
          <Image
            src="/images/女性、申し込み.png"
            alt="オンライン申し込みをする女性"
            width={460}
            height={260}
            className="h-auto w-full rounded-3xl shadow object-cover"
          />
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-brand-blue">予約のポイント</h3>
            <ul className="mt-3 space-y-1">
              <li>・選択した枠は 15 分間仮押さえされます（デモ）。</li>
              <li>・確定後にデモ通知メールが送信されます。</li>
              <li>・決済は後から `/api/payments/pay` を呼び出して確認できます。</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
