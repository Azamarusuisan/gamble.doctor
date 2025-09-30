"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const tzFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit"
});

const dateFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short"
});

type Slot = {
  id: string;
  start: string;
  end: string;
};

type AppointmentResponse = {
  id: string;
  status: string;
  videoUrl?: string;
};

export function BookingWidget() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "details" | "complete">("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState<"初診" | "再診">("初診");
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTelemedicine, setConsentTelemedicine] = useState(false);
  const [result, setResult] = useState<AppointmentResponse | null>(null);

  useEffect(() => {
    async function loadSlots() {
      try {
        setLoadingSlots(true);
        const response = await fetch("/api/slots?status=available");
        if (!response.ok) {
          throw new Error("failed to load");
        }
        const data = await response.json();
        setSlots(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        setError("スロットの取得に失敗しました");
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, []);

  const groupedByDate = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const start = new Date(slot.start);
      const key = start.toISOString().split("T")[0];
      acc[key] = acc[key] ? [...acc[key], slot] : [slot];
      return acc;
    }, {});
  }, [slots]);

  const sortedDates = useMemo(() => Object.keys(groupedByDate).sort(), [groupedByDate]);

  const handleDetailsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlot) {
      setError("予約枠を選択してください");
      return;
    }
    if (!consentPrivacy || !consentTelemedicine) {
      setError("必要な同意にチェックしてください");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      patient: {
        name: String(formData.get("name") ?? ""),
        kana: formData.get("kana") ? String(formData.get("kana")) : undefined,
        email: String(formData.get("email") ?? ""),
        phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
        dob: formData.get("dob") ? String(formData.get("dob")) : undefined,
        isFamily: formData.get("isFamily") === "on"
      },
      slotId: selectedSlot.id,
      type,
      consents: [
        { type: "privacy", version: "v1" },
        { type: "telemedicine", version: "v1" }
      ]
    };

    try {
      setError(null);
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message ?? "予約に失敗しました");
      }
      setResult(data);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "予約に失敗しました");
    }
  };

  function reset() {
    setStep("date");
    setSelectedDate(null);
    setSelectedSlot(null);
    setResult(null);
  }

  return (
    <div className="space-y-8">
      {error ? <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      {step === "date" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-blue">1. 日付を選択</h2>
          {loadingSlots ? (
            <p className="text-sm text-slate-600">読み込み中...</p>
          ) : (
            <div className="space-y-4">
              {/* Calendar Grid */}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-600 mb-2">
                  <div>日</div>
                  <div>月</div>
                  <div>火</div>
                  <div>水</div>
                  <div>木</div>
                  <div>金</div>
                  <div>土</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const currentDate = new Date();
                    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const startDay = startOfMonth.getDay();
                    const day = i - startDay + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dateKey = date.toISOString().split("T")[0];
                    const hasSlots = groupedByDate[dateKey]?.length > 0;
                    const isCurrentMonth = day > 0 && day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (hasSlots) {
                            setSelectedDate(dateKey);
                            setStep("time");
                          }
                        }}
                        disabled={!hasSlots || !isCurrentMonth}
                        className={`h-10 rounded ${
                          !isCurrentMonth ? "text-slate-300" :
                          hasSlots ? "bg-brand-light text-brand-blue hover:bg-brand-teal hover:text-white cursor-pointer font-semibold" :
                          "text-slate-400"
                        } transition-colors`}
                      >
                        {isCurrentMonth ? day : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available dates list */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-600">予約可能日</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {sortedDates.map((dateKey) => {
                    const slotsForDate = groupedByDate[dateKey];
                    const displayDate = slotsForDate?.length ? dateFormat.format(new Date(slotsForDate[0].start)) : dateKey;
                    return (
                      <button
                        key={dateKey}
                        onClick={() => {
                          setSelectedDate(dateKey);
                          setStep("time");
                        }}
                        className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-brand-blue"
                      >
                        <span className="text-sm font-semibold text-brand-blue">{displayDate}</span>
                        <p className="text-xs text-slate-500">空き {slotsForDate?.length ?? 0} 件</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "time" && selectedDate && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-blue">2. 時間を選択</h2>
          <div className="flex flex-wrap gap-2">
            {groupedByDate[selectedDate]?.map((slot) => {
              const start = tzFormat.format(new Date(slot.start));
              const end = tzFormat.format(new Date(slot.end));
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep("details");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isSelected ? "bg-brand-blue text-white" : "border border-slate-200 bg-white text-brand-blue"
                  }`}
                >
                  {start} - {end}
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep("date")} className="text-sm text-slate-500">
            ← 日付を選び直す
          </button>
        </div>
      )}

      {step === "details" && selectedSlot && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-brand-blue">3. 情報を入力</h2>
          <form className="space-y-5" onSubmit={handleDetailsSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name">氏名 *</label>
                <input id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="kana">フリガナ</label>
                <input id="kana" name="kana" />
              </div>
              <div>
                <label htmlFor="email">メール *</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div>
                <label htmlFor="phone">電話番号</label>
                <input id="phone" name="phone" />
              </div>
              <div>
                <label htmlFor="dob">生年月日</label>
                <input id="dob" name="dob" type="date" />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input id="isFamily" name="isFamily" type="checkbox" />
                <label htmlFor="isFamily">家族・支援者として予約する</label>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">診療種別</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType("初診")}
                  className={`rounded-full px-4 py-2 text-sm ${
                    type === "初診" ? "bg-brand-blue text-white" : "border border-slate-200"
                  }`}
                >
                  初診
                </button>
                <button
                  type="button"
                  onClick={() => setType("再診")}
                  className={`rounded-full px-4 py-2 text-sm ${
                    type === "再診" ? "bg-brand-blue text-white" : "border border-slate-200"
                  }`}
                >
                  再診
                </button>
              </div>
            </div>
            <div className="space-y-2 rounded-3xl border border-slate-200 bg-brand-light/60 p-4 text-sm text-slate-600">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={consentPrivacy} onChange={(event) => setConsentPrivacy(event.target.checked)} />
                <span>
                  プライバシーポリシー（v1）に同意します。
                  <br />
                  <a href="/legal#privacy" className="underline">内容を確認する</a>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={consentTelemedicine}
                  onChange={(event) => setConsentTelemedicine(event.target.checked)}
                />
                <span>
                  オンライン診療同意書（v1）に同意します。
                  <br />
                  <a href="/legal#telemedicine" className="underline">内容を確認する</a>
                </span>
              </label>
            </div>
            <button type="submit" className="btn-primary w-full">
              予約を確定する
            </button>
            <button type="button" onClick={() => setStep("time")} className="w-full text-sm text-slate-500">
              ← 時間を選び直す
            </button>
          </form>
        </div>
      )}

      {step === "complete" && result && selectedSlot && (
        <div className="space-y-4 rounded-3xl border border-brand-teal bg-brand-light/60 p-6">
          <h2 className="text-lg font-semibold text-brand-blue">予約が完了しました</h2>
          <p className="text-sm text-slate-600">
            予約 ID: {result.id} / ステータス: {result.status}
          </p>
          <p className="text-sm text-slate-600">
            ビデオ通話 URL: {result.videoUrl ?? "準備中（デモ）"}
          </p>
          <button onClick={reset} className="btn-secondary">
            続けて別の予約を作成する
          </button>
        </div>
      )}
    </div>
  );
}
