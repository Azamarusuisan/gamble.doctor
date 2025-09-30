"use client";

import { FormEvent, useState } from "react";

const roles = [
  { value: "本人", label: "ご本人" },
  { value: "家族", label: "ご家族" },
  { value: "その他", label: "支援者・その他" }
];

const channels = [
  { value: "メール", label: "メール" },
  { value: "SMS", label: "SMS" }
];

export function AnonymousInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const rawEntries = Object.fromEntries(formData.entries());
    const payload = {
      ...rawEntries,
      email: rawEntries.email ? String(rawEntries.email) : undefined,
      sms: rawEntries.sms ? String(rawEntries.sms) : undefined,
      role: String(rawEntries.role ?? roles[0].value),
      channel: String(rawEntries.channel ?? channels[0].value)
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error?.message ?? "送信に失敗しました");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="anonymous-inquiry">
      <div>
        <label htmlFor="nickname">ニックネーム</label>
        <input id="nickname" name="nickname" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" placeholder="optional" />
        </div>
        <div>
          <label htmlFor="sms">SMS（任意）</label>
          <input id="sms" name="sms" placeholder="09012345678" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="role">立場</label>
          <select id="role" name="role" defaultValue={roles[0].value}>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="channel">希望連絡</label>
          <select id="channel" name="channel" defaultValue={channels[0].value}>
            {channels.map((channel) => (
              <option key={channel.value} value={channel.value}>
                {channel.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message">相談内容</label>
        <textarea id="message" name="message" rows={4} required placeholder="例）パチンコ・スロットがやめられず借入が増えています。受診までの流れを知りたい。" />
      </div>
      <p className="text-xs text-slate-600">※匿名相談に費用はかかりません。</p>
      {status === "success" ? (
        <p className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-blue">
          送信ありがとうございます。看護師より折り返しをご連絡します（デモ環境）。
        </p>
      ) : null}
      {status === "error" && error ? (
        <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}
      <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
        {status === "loading" ? "送信中..." : "匿名相談を送信"}
      </button>
    </form>
  );
}
