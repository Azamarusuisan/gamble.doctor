# 改善されたヒーローセクション実装

## 1. 完成コード

```tsx
{/* Hero Section */}
<section className="hero relative min-h-[600px] md:min-h-[700px] bg-white overflow-hidden">
  {/* 背景画像 + グラデーションオーバーレイ */}
  <div className="absolute inset-0">
    <img
      src="/images/team-hero.jpg"
      alt="オンライン診療イメージ"
      className="w-full h-full object-cover"
      loading="eager"
      width="1920"
      height="1080"
    />
    {/* 左→右グラデーション（左側暗め → 右側透明） */}
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-slate-900/10" />
  </div>

  {/* コンテンツ */}
  <div className="relative container mx-auto px-6 md:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px] md:min-h-[700px]">
      {/* 左カラム：テキスト */}
      <div className="py-32 md:py-40 max-w-[560px] space-y-8 motion-safe:animate-fade-in">
        {/* H1 */}
        <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] tracking-tight text-white">
          今日やめるを、<br />続けられる。
        </h1>

        {/* 補足 */}
        <p className="text-[17px] md:text-[18px] leading-[1.6] text-white/95">
          初回相談からフォローまでオンライン。専門医と心理士が、回復の道筋を一緒に作ります。
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/#inquiry"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-[#176B5B] text-white font-medium rounded-xl transition-all duration-200 hover:bg-[#1a7f68] focus:outline-none focus:ring-2 focus:ring-[#176B5B] focus:ring-offset-2 shadow-lg"
          >
            まずは匿名で相談
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-3.5 border-2 border-white/80 text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            料金を見る
          </Link>
        </div>
      </div>

      {/* 右カラム：画像スペース（画像は背景で表示） */}
      <div className="hidden md:block" />
    </div>
  </div>
</section>

{/* 安心帯（ヒーロー直下） */}
<section className="bg-slate-50 border-y border-slate-200">
  <div className="container mx-auto px-6 md:px-8 py-4">
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-slate-700">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>個人情報保護</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>当日枠あり</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>家族同席OK</span>
      </div>
    </div>
  </div>
</section>
```

## 2. デザインと可読性の改善ポイント

### ✅ 視線誘導の最適化
- **白ボックス削除**: 背景画像の上に個別の白ボックスを配置せず、グラデーションオーバーレイのみで可読性を確保
- **左→右グラデーション**: `from-slate-900/60` → `to-slate-900/10` で左側のテキストエリアを暗くし、コントラストを確保
- **視線の流れ**: H1 → 補足 → 主CTA → 副CTA の明確な縦の流れ

### ✅ 情報の集約
- **3ブロック構成**: H1 / 補足1文 / CTA 2つ のみに集約
- **バッジ移動**: 「個人情報保護」「当日枠あり」「家族同席OK」をヒーロー直下の安心帯に移動
- **CTAの優先度明確化**:
  - 主CTA: 濃いグリーン (#176B5B) のフルカラーボタン
  - 副CTA: 白枠のアウトラインボタン

### ✅ タイポグラフィの最適化
- **H1**: 32px/40px、行高1.2、白文字で明瞭
- **補足**: 17px/18px、行高1.6、95%不透明度で階層化
- **1文完結**: 補足を1文に統合し、行間・文字数を最適化

### ✅ コントラストの改善
- **WCAG AA準拠**: 白文字 on グラデーション暗部で 4.5:1 以上のコントラスト
- **ホバー状態**: 主CTAは明度UP、副CTAは背景に薄い白を追加

### ✅ パフォーマンス最適化
- **LCP対策**: `<img>` タグで `loading="eager"` + `width/height` 指定
- **CLS回避**: 画像サイズ指定でレイアウトシフト防止
- **軽量アニメーション**: `motion-safe:animate-fade-in` でprefers-reduced-motion対応

### ✅ レスポンシブ対応
- **モバイル**: 縦積みレイアウト、H1/補足/主CTAが初回表示で見える
- **デスクトップ**: 左右2カラム、左にテキスト（max-width: 560px）、右に画像

## 3. 既存プロジェクトへの差し替え手順

### Step 1: 既存コードの削除
`app/page.tsx` 内の以下の部分を削除:
```tsx
// 行52-130 (Hero Section全体)
{/* Hero Section - 背景面構成 */}
<section className="relative min-h-[640px] md:min-h-[700px] bg-slate-900 overflow-hidden">
  ...
</section>
```

### Step 2: 新しいコードの挿入
削除した箇所に、上記の「完成コード」をそのまま貼り付け

### Step 3: CSSの確認
`globals.css` に以下が存在することを確認（既にあればOK）:
```css
@keyframes fadeIn {
  '0%': { opacity: '0', transform: 'translateY(12px)' },
  '100%': { opacity: '1', transform: 'translateY(0)' },
}
```

### Step 4: 不要なクラスの削除
以下のカスタムクラスが不要になるため削除可能:
- 個別の白ボックス用のスタイル（既に inline で記述されているため影響なし）

## 4. テスト項目

### ✅ モバイル折返し
- [ ] 375px幅で H1/補足/主CTA が初回表示に収まる
- [ ] テキストが画面幅に応じて適切に折り返される
- [ ] CTAボタンが縦積みで表示される

### ✅ コントラスト
- [ ] H1（白文字）が背景画像上で読みやすい（コントラスト比 4.5:1 以上）
- [ ] 補足文が読みやすい（white/95）
- [ ] CTAボタンのテキストがWCAG AA準拠

### ✅ フォーカスリング
- [ ] 主CTAにキーボードフォーカスで緑色リングが表示
- [ ] 副CTAにキーボードフォーカスで白色リングが表示
- [ ] Tabキーで順序通りに移動可能

### ✅ LCP（Largest Contentful Paint）
- [ ] ヒーロー画像が 2.5秒以内に読み込まれる
- [ ] `loading="eager"` が機能している
- [ ] WebP形式への最適化（推奨）

### ✅ CLS（Cumulative Layout Shift）
- [ ] 画像読み込み時にレイアウトシフトが発生しない
- [ ] `width`/`height` 属性が機能している

### ✅ アクセシビリティ
- [ ] `prefers-reduced-motion` 設定時にアニメーションが無効化される
- [ ] スクリーンリーダーで H1 → 補足 → CTA の順に読み上げられる
- [ ] 画像に適切な alt 属性がある

## 5. 最終チェックリスト

- [ ] 白ボックスが削除され、視線が分散していない
- [ ] グラデーションでテキストのコントラストが確保されている
- [ ] CTAが2つのみで、主/副の優先度が明確
- [ ] H1と補足が簡潔で、1画面に収まる
- [ ] 安心帯のバッジがヒーロー直下に移動している
- [ ] モバイルで主CTAまで初回表示されている
- [ ] 画像読み込みが最適化されている（LCP/CLS）
- [ ] すべてのinteractive要素にフォーカスリングがある