export const FLOW_STEPS = [
  {
    step: 1,
    title: "匿名相談",
    duration: "約15分",
    icon: "ChatBubbleLeftIcon",
    points: [
      "フォーム送信 → 48時間以内に専門スタッフが返信",
      "ご家族のみの相談OK",
      "連絡先はメール / SMS どちらかでOK"
    ],
    prep: ["メールまたはSMS"]
  },
  {
    step: 2,
    title: "オンライン問診",
    duration: "約30分",
    icon: "ClipboardDocumentListIcon",
    points: [
      "看護師・心理士がヒアリング",
      "流れ・費用・受診可否を整理",
      "方針の仮決めと次の案内"
    ],
    prep: ["本人確認書類", "保険証(任意)"]
  },
  {
    step: 3,
    title: "初診",
    duration: "約45分",
    icon: "VideoCameraIcon",
    points: [
      "専門医が診察し、依存の段階を確認",
      "治療方針と回復プランを提示",
      "支援制度も一緒に検討"
    ],
    prep: ["カメラ付き端末", "静かな環境"]
  },
  {
    step: 4,
    title: "支援計画",
    duration: "約30分",
    icon: "DocumentTextIcon",
    points: [
      "行動制限・家族支援を組み合わせた計画",
      "金融機関・専門機関との連携プラン",
      "必要に応じ専門職を紹介"
    ],
    prep: ["家計メモ", "同行支援希望(任意)"]
  },
  {
    step: 5,
    title: "フォローアップ",
    duration: "約30分",
    icon: "ArrowPathIcon",
    points: [
      "再発防止のための継続面談",
      "オンラインプログラムで伴走",
      "家族会など継続支援を実施"
    ],
    prep: ["次回予約候補"]
  }
];