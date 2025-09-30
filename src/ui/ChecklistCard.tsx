"use client";

import { useState } from "react";

const concerns = [
  "「やめたい」と思っても、負けを取り返そうとしてしまう",
  "借入や返済が限界で、誰にも打ち明けられない",
  "仕事・学業・家族関係に支障が出ている",
  "家族のギャンブルがやめられず、どう接していいか分からない",
  "医療につながるべきか判断できない／怖い"
];

export function ChecklistCard() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  const handleCheckboxChange = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className="info-card" role="complementary" aria-label="簡易チェックと相談">
      <h3 className="text-lg font-bold text-brand-blue mb-4">
        こんなお悩みはありませんか？
      </h3>

      <div className="space-y-3 mb-4">
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

      {selectedItems.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-brand-blue mb-2">
            ✓ {selectedItems.length}項目該当しています
          </p>
          <p className="text-sm text-slate-700">
            あなたに適切な治療を提示します。下記のフォームからご相談ください。
          </p>
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          詳細な悩みがあれば書き込んでください（任意）
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="例：パチンコで借金が増えてしまい、家族にも言えず困っています..."
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs font-semibold text-brand-teal mb-2">
          🎰 パチンコ・スロット・競馬・競輪・カジノなど、全てのギャンブルに対応しています
        </p>
        <p className="text-xs text-slate-600">
          匿名OK・料金不要・営業日内に専門スタッフが返信。医師につながる最短ルートをご案内します。
        </p>
      </div>
    </div>
  );
}