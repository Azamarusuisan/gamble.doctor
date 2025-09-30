# 予約機能セットアップガイド

## 📋 概要
予約機能を本番環境で動かすための完全ガイドです。データベース設定から外部API連携まで、必要な設定をすべて説明します。

## 🚀 クイックスタート（最小構成）

最低限必要な設定だけで予約機能を動かす手順：

### 1. データベース設定

```bash
# SQLiteを使う場合（開発環境）
DATABASE_URL="file:./dev.db"

# PostgreSQLを使う場合（本番環境推奨）
DATABASE_URL="postgresql://user:password@localhost:5432/gambling_doctor"
```

### 2. 環境変数設定

`.env.local`ファイルを作成：

```bash
# 必須設定
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secret-key-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# メール通知（SendGrid）- 必須
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.jp"
SENDGRID_FROM_NAME="ギャンブルドクター"
```

### 3. データベース初期化

```bash
# Prismaのセットアップ
npx prisma generate
npx prisma db push

# 初期データ投入（スロット作成）
npx prisma db seed
```

## 📊 データベース構成

### Prismaスキーマ（主要テーブル）

```prisma
// 患者情報
model Patient {
  id           String   @id @default(uuid())
  name         String   // 氏名
  kana         String   // カナ
  email        String   // メールアドレス
  phone        String?  // 電話番号
  dob          DateTime? // 生年月日
  appointments Appointment[]
}

// 予約枠
model Slot {
  id          String   @id @default(uuid())
  start       DateTime // 開始時刻
  end         DateTime // 終了時刻
  status      String   // available, booked
  appointment Appointment?
}

// 予約
model Appointment {
  id        String   @id @default(uuid())
  patientId String
  slotId    String   @unique
  type      String   // initial(初診), follow(再診)
  status    String   // booked, completed, cancelled
  videoUrl  String?  // Google Meetリンク
  patient   Patient  @relation(fields: [patientId], references: [id])
  slot      Slot     @relation(fields: [slotId], references: [id])
}
```

## 🔧 必要なAPI設定

### 1. SendGrid（メール送信） - 必須

#### 無料アカウント作成
1. [SendGrid](https://sendgrid.com/)にアクセス
2. 無料プランで登録（月100通まで無料）
3. メールアドレス認証を完了

#### APIキー作成
```bash
# SendGrid管理画面で：
Settings → API Keys → Create API Key
→ Full Accessを選択
→ APIキーをコピー

# .env.localに追加：
SENDGRID_API_KEY="SG.実際のAPIキー"
SENDGRID_FROM_EMAIL="clinic@yourdomain.jp"
```

#### 送信者認証
```bash
Settings → Sender Authentication
→ Single Sender Verification
→ 送信元メールアドレスを登録
→ 認証メールを確認
```

### 2. Google Meet（ビデオ通話） - 自動生成

現在の実装では、Google Meetのリンクを自動生成しています。
実際のGoogle Calendar APIと連携する場合：

```bash
# Google Cloud Console設定
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxxx"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
```

### 3. SMS通知（Twilio） - オプション

```bash
# Twilioアカウント作成後
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+81xxxxxxxxx"
```

## 📝 予約フロー

### 1. 予約作成API

```typescript
POST /api/appointments
{
  "slotId": "slot-uuid",
  "type": "初診",
  "patient": {
    "name": "山田太郎",
    "kana": "ヤマダタロウ",
    "email": "yamada@example.com",
    "phone": "090-1234-5678",
    "dob": "1990-01-01"
  }
}

// レスポンス
{
  "id": "appointment-uuid",
  "status": "booked",
  "videoUrl": "https://meet.google.com/xxx-xxxx-xxx"
}
```

### 2. 自動処理

予約が作成されると自動的に：
1. Google Meetリンク生成
2. 患者へ確認メール送信
3. カレンダーファイル（.ics）生成可能
4. リマインダー設定（24時間前）

## 🛠 開発環境でのテスト

### 1. パッケージインストール

```bash
npm install @sendgrid/mail
npm install --save-dev @types/node
```

### 2. テスト用設定

```bash
# .env.local（開発環境）
DATABASE_URL="file:./dev.db"
SESSION_SECRET="dev-secret-key"
SENDGRID_API_KEY="実際のAPIキー"
SENDGRID_FROM_EMAIL="test@example.com"
```

### 3. データベース準備

```bash
# Prismaセットアップ
npx prisma generate
npx prisma db push

# テスト用スロット作成
npx prisma studio
# → GUIでSlotテーブルに予約枠を追加
```

### 4. 動作確認

```bash
# 開発サーバー起動
npm run dev

# ブラウザでアクセス
http://localhost:3000/book
```

## 📱 本番環境デプロイ

### Vercel使用時

```bash
# 環境変数設定（Vercel Dashboard）
DATABASE_URL="postgresql://..."
SESSION_SECRET="本番用シークレット"
SENDGRID_API_KEY="本番用APIキー"
SENDGRID_FROM_EMAIL="clinic@yourdomain.jp"
NEXT_PUBLIC_APP_URL="https://yourdomain.jp"
```

### データベース移行

```bash
# PostgreSQL接続
npx prisma migrate deploy

# 初期データ投入
npx prisma db seed
```

## 🔍 トラブルシューティング

### よくあるエラー

#### 1. メール送信エラー
```
Error: Unauthorized (SendGrid)
```
**解決法**: APIキーと送信者認証を確認

#### 2. データベース接続エラー
```
Error: P1001: Can't reach database
```
**解決法**: DATABASE_URLの接続文字列を確認

#### 3. セッションエラー
```
Error: Session secret not set
```
**解決法**: SESSION_SECRET環境変数を設定

## 📞 サポート

設定で困ったら：

1. **ドキュメント確認**
   - `/docs/API_SETUP.md` - 外部API詳細
   - `/README.md` - プロジェクト概要

2. **ログ確認**
   ```bash
   # 開発環境のログ
   npm run dev
   # → コンソールでエラー詳細確認
   ```

3. **データベース確認**
   ```bash
   npx prisma studio
   # → ブラウザでデータ確認
   ```

## ✅ チェックリスト

予約機能を動かすための最終確認：

- [ ] `.env.local`ファイル作成済み
- [ ] DATABASE_URL設定済み
- [ ] SESSION_SECRET設定済み
- [ ] SendGrid APIキー取得済み
- [ ] SendGrid送信者認証完了
- [ ] `npx prisma generate`実行済み
- [ ] `npx prisma db push`実行済み
- [ ] テスト用スロットデータ作成済み
- [ ] `npm run dev`でエラーなし
- [ ] `/book`ページで予約テスト成功

これで予約機能が使えるようになります！