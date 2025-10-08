import Image from "next/image";
import { BookingWidget } from "./components/BookingWidget";
import { Section } from "@/ui/Section";

export default function BookPage() {
  return (
    <Section
      title="オンライン予約"
      description="カレンダーから枠を選び、情報を入力するだけで予約が完了します。予約完了後、登録されたメールアドレスに確認メールが送信されます。"
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
              <li>・予約確定後、メールで予約完了通知が届きます</li>
              <li>・Google Meetのリンクがメールに記載されます</li>
              <li>・診療時間の5分前から入室可能です</li>
              <li>・キャンセルは24時間前まで無料で可能です</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
