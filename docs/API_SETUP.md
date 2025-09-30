# 外部API設定ガイド

## 概要
本アプリケーションを本番環境で動かすために必要な外部サービスの設定方法です。

## 必要な外部サービス一覧

| サービス | 用途 | 料金 | 優先度 |
|---------|------|------|--------|
| Stripe | 決済処理 | 決済額の3.6% | 必須 |
| SendGrid | メール送信 | 月100通まで無料 | 必須 |
| Twilio | SMS送信 | 従量課金（約15円/通） | 任意 |
| Zoom | ビデオ通話 | 月2,000円〜 | 推奨 |

## セットアップ手順

### 1. Stripe（決済）

#### アカウント作成
1. https://stripe.com/jp にアクセス
2. 「今すぐ始める」をクリック
3. メールアドレスとパスワードを設定
4. 事業情報を入力

#### APIキー取得
1. ダッシュボード → 開発者 → APIキー
2. 公開可能キーとシークレットキーをコピー
3. `.env.local`に設定：
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### Webhook設定
1. 開発者 → Webhook → エンドポイント追加
2. URL: `https://yourdomain.jp/api/payments/stripe/webhook`
3. イベント選択：
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded
4. 署名シークレットをコピー：
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. SendGrid（メール）

#### アカウント作成
1. https://sendgrid.com/ にアクセス
2. 無料プランで登録
3. メール認証を完了

#### APIキー作成
1. Settings → API Keys → Create API Key
2. フルアクセスを選択
3. APIキーをコピー：
```bash
SENDGRID_API_KEY=SG.xxxxx
```

#### 送信者認証
1. Settings → Sender Authentication
2. Single Sender Verificationを選択
3. 送信元メールアドレスを登録
4. 認証メールから確認

### 3. Twilio（SMS）

#### アカウント作成
1. https://www.twilio.com/ja/ にアクセス
2. 無料トライアルで登録
3. 電話番号認証を完了

#### 認証情報取得
1. Console Dashboard → Account Info
2. Account SIDとAuth Tokenをコピー：
```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
```

#### 電話番号購入
1. Phone Numbers → Buy a Number
2. 日本の番号を選択（月額約150円）
3. SMS機能を有効化
```bash
TWILIO_PHONE_NUMBER=+81xxxxxxxxx
```

### 4. Zoom（ビデオ通話）

#### 開発者アカウント
1. https://marketplace.zoom.us/ にアクセス
2. 開発者として登録

#### アプリ作成
1. Build App → JWT（廃止予定）またはServer-to-Server OAuth
2. アプリ情報を入力
3. 認証情報を取得：
```bash
ZOOM_API_KEY=xxxxx
ZOOM_API_SECRET=xxxxx
```

#### スコープ設定
必要なスコープ：
- meeting:write
- meeting:read
- recording:read
- user:read

## パッケージインストール

```bash
# すべての外部サービスパッケージをインストール
npm install stripe @stripe/stripe-js @sendgrid/mail twilio @zoom/videosdk jsonwebtoken axios
```

## 環境変数設定

`.env.local`ファイルを作成：

```bash
# 本番環境用の設定例
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.jp

# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Session
SESSION_SECRET="generate-strong-random-string-here"

# Stripe
STRIPE_SECRET_KEY="sk_live_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# SendGrid
SENDGRID_API_KEY="SG.xxxxx"
SENDGRID_FROM_EMAIL="noreply@yourdomain.jp"
SENDGRID_FROM_NAME="ギャンブルドクター"

# Twilio
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+81xxxxxxxxx"

# Zoom
ZOOM_API_KEY="xxxxx"
ZOOM_API_SECRET="xxxxx"
```

## 動作確認

### 1. 決済テスト
```bash
# テスト用カード番号
4242 4242 4242 4242
有効期限: 任意の未来日付
CVC: 任意の3桁
```

### 2. メールテスト
```javascript
// /api/test/email にアクセス
await sendEmail('test@example.com', 'テスト', '<h1>テストメール</h1>');
```

### 3. SMSテスト
```javascript
// /api/test/sms にアクセス
await sendSMS('090-1234-5678', 'テストSMS');
```

### 4. ビデオ通話テスト
```javascript
// /api/test/video にアクセス
await createZoomMeeting('テスト診療', new Date(), 30);
```

## トラブルシューティング

### Stripe
- **エラー: Invalid API Key**
  - 本番用と開発用のキーを確認
  - `sk_live_`で始まるのが本番用

### SendGrid
- **エラー: Unauthorized**
  - APIキーの権限を確認
  - Sender Authenticationが完了しているか確認

### Twilio
- **エラー: Invalid phone number**
  - 日本の番号は+81から始まる
  - 最初の0を除いて入力

### Zoom
- **エラー: Invalid access token**
  - JWTトークンの有効期限を確認
  - Server-to-Server OAuthへの移行を検討

## セキュリティ注意事項

1. **APIキーは絶対にGitにコミットしない**
2. **環境変数は`.env.local`に保存**
3. **本番環境では環境変数管理サービス使用推奨**（Vercel, Heroku等）
4. **Webhookは署名検証を必ず実装**
5. **CORS設定で許可するドメインを制限**

## 参考リンク

- [Stripe公式ドキュメント（日本語）](https://stripe.com/docs/api?lang=node)
- [SendGrid公式ドキュメント](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Twilio公式ドキュメント](https://www.twilio.com/docs/sms)
- [Zoom API公式ドキュメント](https://marketplace.zoom.us/docs/api-reference/introduction)