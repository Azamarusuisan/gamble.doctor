"use client";

import { FormEvent, useEffect, useState } from "react";

const initialState = {
  appointmentsToday: [] as Array<{ id: string; start: string; patient: string; status: string }>,
  appointmentsWeek: [] as Array<{ id: string; start: string; patient: string; status: string }>,
  pendingInquiries: [] as Array<{ id: string; nickname: string; createdAt: string }>
};

type Overview = typeof initialState;

export default function AdminPage() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [overview, setOverview] = useState<Overview>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    try {
      setLoading(true);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error?.message ?? "ログインに失敗しました");
      }
      setSession({ email: payload.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!session) return;
    async function loadOverview() {
      try {
        const response = await fetch("/api/admin/overview");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error?.message ?? "概要の取得に失敗しました");
        }
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "概要の取得に失敗しました");
      }
    }
    loadOverview();
  }, [session]);

  if (!session) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-brand-blue">管理ログイン</h1>
        <p className="mt-2 text-sm text-slate-600">デモ用アカウント：doctor@example.com / password: demoadmin</p>
        {error ? <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input id="email" name="email" type="email" defaultValue="doctor@example.com" required />
          </div>
          <div>
            <label htmlFor="password">パスワード</label>
            <input id="password" name="password" type="password" defaultValue="demoadmin" required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-blue">ダッシュボード</h1>
        <p className="mt-2 text-sm text-slate-600">{session.email} としてログイン中</p>
        {error ? <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-blue">本日の予約</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {overview.appointmentsToday.length ? (
                overview.appointmentsToday.map((item) => (
                  <li key={item.id}>
                    {item.start} ｜ {item.patient} ｜ {item.status}
                  </li>
                ))
              ) : (
                <li>本日の予約はありません。</li>
              )}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-blue">今週の予約</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {overview.appointmentsWeek.length ? (
                overview.appointmentsWeek.map((item) => (
                  <li key={item.id}>
                    {item.start} ｜ {item.patient} ｜ {item.status}
                  </li>
                ))
              ) : (
                <li>今週の予約はありません。</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-blue">未対応の匿名相談</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {overview.pendingInquiries.length ? (
              overview.pendingInquiries.map((item) => (
                <li key={item.id}>
                  {item.createdAt} ｜ {item.nickname}
                </li>
              ))
            ) : (
              <li>未対応の相談はありません。</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
