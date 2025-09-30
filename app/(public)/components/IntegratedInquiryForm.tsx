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

const concerns = [
  "「やめたい」と思っても、負けを取り返そうとしてしまう",
  "借入や返済が限界で、誰にも打ち明けられない",
  "仕事・学業・家族関係に支障が出ている",
  "家族のギャンブルがやめられず、どう接していいか分からない",
  "医療につながるべきか判断できない／怖い",
  "パチンコ・スロットで生活費を使い込んでしまう",
  "競馬・競輪・競艇で給料日後すぐに使い果たす",
  "オンラインカジノで深夜まで続けてしまう",
  "宝くじ・ロトを大量に購入してしまう",
  "ギャンブルのことが頭から離れず、仕事や勉強に集中できない"
];

export function IntegratedInquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);

  const handleCheckboxChange = (item: string) => {
    let newSelectedItems: string[];
    if (selectedItems.includes(item)) {
      newSelectedItems = selectedItems.filter(i => i !== item);
    } else {
      newSelectedItems = [...selectedItems, item];
    }
    setSelectedItems(newSelectedItems);

    // チェックボックスの内容をメッセージに自動反映
    if (newSelectedItems.length > 0) {
      let autoMessage = "【該当する項目】\n";
      newSelectedItems.forEach((selectedItem, index) => {
        autoMessage += `${index + 1}. ${selectedItem}\n`;
      });
      autoMessage += "\n【詳細な相談内容】\n";
      // 既存の詳細部分を保持
      const existingDetails = message.split("【詳細な相談内容】\n")[1] || "";
      autoMessage += existingDetails;
      setMessage(autoMessage);
    } else {
      // チェックが全て外れた場合は詳細部分のみ保持
      const existingDetails = message.split("【詳細な相談内容】\n")[1] || "";
      setMessage(existingDetails);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const rawEntries = Object.fromEntries(formData.entries());

    const payload = {
      ...rawEntries,
      message: message, // 編集可能なメッセージを使用
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
      setSelectedItems([]);
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6" id="anonymous-inquiry">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          {/* 左側：フォーム入力 */}
          <div className="space-y-4">
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

            {/* 編集可能な相談内容 */}
            <div>
              <label htmlFor="message">相談内容</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="右側のチェックボックスで項目を選択すると、ここに自動的に反映されます。追加で詳細を書き込むこともできます。"
              />
            </div>
          </div>

          {/* 右側：チェックボックス */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
              className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-slate-50 transition"
            >
              <div>
                <h3 className="text-lg font-bold text-brand-blue">
                  こんなお悩みはありませんか?
                </h3>
                {!isChecklistExpanded && (
                  <p className="text-xs text-slate-500 mt-1">
                    クリックしてチェックボックスを開く
                  </p>
                )}
              </div>
              <span className="text-brand-blue text-2xl font-bold">
                {isChecklistExpanded ? "−" : "+"}
              </span>
            </button>

            {isChecklistExpanded && (
              <div className="space-y-3">
                {concerns.map((concern, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(concern)}
                      onChange={() => handleCheckboxChange(concern)}
                      className="mt-1 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm text-slate-700 leading-relaxed">
                      {concern}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-brand-blue mb-2">
                  ✓ {selectedItems.length}項目該当しています
                </p>
                <p className="text-sm text-slate-700">
                  あなたに適切な治療を提示します。左側のフォームから送信してください。
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-brand-teal mb-2">
                パチンコ・スロット・競馬・競輪・カジノなど、全てのギャンブルに対応しています
              </p>
              <p className="text-xs text-slate-600">
                匿名OK・料金不要・営業日内に専門スタッフが返信。医師につながる最短ルートをご案内します。
              </p>
            </div>
          </div>
        </div>

        {/* フォーム送信ボタン */}
        <div className="space-y-3">
          <p className="text-xs text-slate-600">※匿名相談に費用はかかりません。</p>
          {status === "success" ? (
            <p className="rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-blue">
              送信ありがとうございます。看護師より折り返しをご連絡します(デモ環境)。
            </p>
          ) : null}
          {status === "error" && error ? (
            <p className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</p>
          ) : null}
          <button type="submit" className="btn-primary w-full" disabled={status === "loading"}>
            {status === "loading" ? "送信中..." : "匿名相談を送信"}
          </button>
        </div>
      </form>
    </div>
  );
}