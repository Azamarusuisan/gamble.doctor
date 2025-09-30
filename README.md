# ギャンブルドクター – 最小MVP

ギャンブル依存症オンライン外来のデモアプリです。匿名相談→予約→セルフチェック→デモ決済までのひと通りの導線と、簡易管理画面を Next.js 14 + Prisma で構築しています。医師名は **浦江晋平**。

## セットアップ

```bash
pnpm install
npx prisma migrate dev --name init
pnpm seed
pnpm dev
```

## 環境変数 (`.env.local`)

```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="change_me"
NOTIFY_DRIVER="console"   # console | file
NOTIFY_LOG_FILE="./notify.log"
APP_TZ="Asia/Tokyo"
```

## 開発メモ

- API は `app/api/*` に実装（JSON ベース）。エラー形式は `{ error: { code, message, details } }`。
- `src/lib/validation.ts` の Zod スキーマを共通利用。匿名相談/予約は 60 秒あたり 1 件にレート制限。
- `prisma/seed.ts` で今週平日 09:00–12:00 / 13:00–18:00（30 分刻み）の枠とダミーデータを投入。
- 通知/決済は `src/lib/notify.ts` のデモ出力。メールは `src/emails/booking-confirm.tsx` をコンソール出力します。
- 管理ログイン：`doctor@example.com` / `demoadmin`。CSV エクスポートとスロット自動生成あり。

## テスト補助

VSCode REST Client 用の `requests.http` を同梱。主要 API の動作確認に利用してください。
