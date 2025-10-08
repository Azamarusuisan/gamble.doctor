# Gmail予約通知システムの設定手順

このドキュメントでは、予約システムのGmail通知とGoogle Meet連携の設定方法を説明します。

## 🎯 機能概要

予約が完了すると以下の処理が自動的に実行されます：

1. **患者様へ予約完了メール送信**
   - 予約日時、診療内容の確認
   - Google Meetリンク（自動生成）
   - キャンセルポリシーの案内

2. **管理者へ新規予約通知メール送信**
   - 患者情報
   - 予約詳細
   - 管理画面へのリンク

3. **Google Meet リンク自動生成**（オプション）
   - Google Calendar APIを使用
   - 診療時間にGoogle Meetリンクを自動作成

---

## 📋 必要な準備

### 1. Gmailアカウント（必須）

予約通知メールの送信に使用します。

### 2. Google Cloud Platform アカウント（オプション）

Google Meet リンク自動生成に必要です。設定しない場合はダミーリンクが使用されます。

---

## ⚙️ 設定手順

### ステップ1: Gmailアプリパスワードの取得

1. **Googleアカウントで2段階認証を有効化**
   - [Google アカウント設定](https://myaccount.google.com/security)
   - 「2段階認証プロセス」を有効にする

2. **アプリパスワードを生成**
   - [アプリパスワード生成ページ](https://myaccount.google.com/apppasswords)にアクセス
   - アプリを選択: `メール`
   - デバイスを選択: `その他（カスタム名）` → 「ギャンブルドクター」など
   - 「生成」をクリック
   - **16桁のパスワードが表示されます（必ずメモしてください）**

### ステップ2: 環境変数の設定

`.env.local` ファイルを編集して以下の値を設定します：

```bash
# Gmail設定（必須）
GMAIL_USER="your-email@gmail.com"  # ← あなたのGmailアドレス
GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"  # ← 生成したアプリパスワード（スペース含む）

# 送信者名
EMAIL_FROM_NAME="ギャンブルドクター"

# 管理者通知先（必須）
ADMIN_EMAIL="admin@example.com"  # ← 予約通知を受け取るメールアドレス

# アプリケーションURL
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # 本番環境では実際のURLに変更
```

---

## 🔧 Google Meet 自動生成設定（オプション）

Google Meet リンクを自動生成したい場合は、以下の設定を行います。

### ステップ1: Google Cloud Platformでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成

### ステップ2: Google Calendar APIを有効化

1. 「APIとサービス」→「ライブラリ」
2. 「Google Calendar API」を検索
3. 「有効にする」をクリック

### ステップ3: サービスアカウントを作成

1. 「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「サービスアカウント」
3. サービスアカウント名を入力（例: `gamble-doctor-calendar`）
4. 「作成して続行」をクリック
5. ロール: `編集者` を選択
6. 「完了」をクリック

### ステップ4: サービスアカウントキーを生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブ → 「鍵を追加」→「新しい鍵を作成」
3. キーのタイプ: `JSON` を選択
4. 「作成」をクリック
5. **JSONファイルがダウンロードされます（大切に保管）**

### ステップ5: Google カレンダーを作成・共有

1. [Google Calendar](https://calendar.google.com/)にアクセス
2. 新しいカレンダーを作成（例: 「オンライン診療」）
3. カレンダーの設定 → 「特定のユーザーと共有」
4. サービスアカウントのメールアドレスを追加（JSONファイル内の `client_email`）
5. 権限: `予定の変更権限を付与` を選択
6. カレンダーIDをコピー（設定 → カレンダー統合 → カレンダーID）

### ステップ6: 環境変数を追加

`.env.local` に以下を追加：

```bash
# Google Calendar API設定
GOOGLE_CLIENT_EMAIL="your-service-account@project-id.iam.gserviceaccount.com"  # JSONファイルのclient_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...省略...\n-----END PRIVATE KEY-----\n"  # JSONファイルのprivate_key
GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"  # カレンダーID
```

**注意**: `GOOGLE_PRIVATE_KEY` は改行が`\n`で表現されます。JSONファイルからコピーする際は、そのままコピーしてください。

---

## ✅ 動作確認

### 1. アプリケーションを起動

```bash
npm run dev
```

### 2. 予約をテスト

1. ブラウザで `http://localhost:3000/book` にアクセス
2. 予約フォームを入力して送信
3. 以下を確認：
   - ✅ ターミナルに `✅ 予約完了メールを送信しました` と表示される
   - ✅ 患者のメールアドレスに予約完了メールが届く
   - ✅ 管理者のメールアドレスに通知メールが届く
   - ✅ Google Meetリンクがメールに含まれている（Google Calendar API設定時）

### 3. トラブルシューティング

#### メールが届かない場合

1. `.env.local` の設定を確認
   - `GMAIL_USER` が正しいか
   - `GMAIL_APP_PASSWORD` が正しいか（スペースを含む16桁）
   - `ADMIN_EMAIL` が正しいか

2. Gmailの設定を確認
   - 2段階認証が有効になっているか
   - アプリパスワードが有効か

3. ターミナルのエラーログを確認
   ```
   ❌ 予約完了メール送信エラー: ...
   ```

#### Google Meetリンクが生成されない場合

1. ダミーリンクが使用されます（`https://meet.google.com/xxxxx`）
2. 実際のGoogle Meetリンクを使用したい場合は、Google Calendar API設定を完了してください
3. 設定後、ターミナルに以下が表示されます：
   ```
   Google Meetリンクが生成されました: https://meet.google.com/xxx-yyyy-zzz
   ```

---

## 📧 メールテンプレートのカスタマイズ

メール本文をカスタマイズしたい場合は、以下のファイルを編集してください：

- **患者向けメール**: `src/lib/email.ts` の `sendBookingConfirmationEmail` 関数
- **管理者向けメール**: `src/lib/email.ts` の `sendNewBookingNotificationToAdmin` 関数

---

## 🔒 セキュリティ注意事項

1. **`.env.local` ファイルは絶対にGitにコミットしないでください**
   - 既に `.gitignore` に含まれています

2. **アプリパスワードは定期的に変更してください**

3. **本番環境では必ず実際のドメインを使用してください**
   ```bash
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

4. **Google サービスアカウントのJSONファイルは安全に保管してください**

---

## 🎨 本番環境への移行

### Vercel にデプロイする場合

1. Vercel ダッシュボード → プロジェクト設定 → Environment Variables
2. 以下の環境変数を追加：
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `EMAIL_FROM_NAME`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_APP_URL`
   - （オプション）`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`

### 注意点

- `GOOGLE_PRIVATE_KEY` はVercelでは自動的にエスケープされるため、そのまま貼り付けてOKです
- 環境変数の変更後は再デプロイが必要です

---

## 📞 サポート

設定でお困りの場合は、以下を確認してください：

1. [Gmail アプリパスワード公式ドキュメント](https://support.google.com/accounts/answer/185833)
2. [Google Calendar API クイックスタート](https://developers.google.com/calendar/api/quickstart/nodejs)
3. [Nodemailer 公式ドキュメント](https://nodemailer.com/)

---

## ✨ 完了！

これで予約システムの設定が完了しました。患者様が予約すると、自動的にメール通知とGoogle Meetリンクが送信されます。
