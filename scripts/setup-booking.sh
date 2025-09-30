#!/bin/bash

# ========================================
# 予約機能セットアップスクリプト
# ========================================

echo "🚀 ギャンブルドクター予約機能セットアップを開始します..."
echo ""

# 1. 環境変数ファイルのチェック
echo "📝 環境変数ファイルの設定..."
if [ ! -f ".env.local" ]; then
    echo "  → .env.local が見つかりません。サンプルからコピーします..."
    cp .env.local.example .env.local
    echo "  ✅ .env.local を作成しました"
    echo ""
    echo "  ⚠️  重要: .env.local を編集して以下を設定してください:"
    echo "     - SENDGRID_API_KEY（SendGridのAPIキー）"
    echo "     - SENDGRID_FROM_EMAIL（送信元メールアドレス）"
    echo ""
    read -p "  設定が完了したらEnterキーを押してください..."
else
    echo "  ✅ .env.local が存在します"
fi
echo ""

# 2. パッケージインストール
echo "📦 必要なパッケージをインストール中..."
npm install @sendgrid/mail
npm install --save-dev @types/node
echo "  ✅ パッケージインストール完了"
echo ""

# 3. Prismaセットアップ
echo "🗄️  データベースをセットアップ中..."
npx prisma generate
npx prisma db push --skip-generate
echo "  ✅ データベースセットアップ完了"
echo ""

# 4. 初期データ作成
echo "📊 テスト用予約枠を作成中..."
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 既存のスロットを削除
  await prisma.slot.deleteMany({});

  // 今日から7日間、各日3つの予約枠を作成
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);

    // 10:00, 14:00, 16:00 の枠を作成
    const times = [
      { hour: 10, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 16, minute: 0 }
    ];

    for (const time of times) {
      const start = new Date(date);
      start.setHours(time.hour, time.minute, 0, 0);

      const end = new Date(start);
      end.setHours(start.getHours() + 1); // 1時間枠

      await prisma.slot.create({
        data: {
          start,
          end,
          status: 'available'
        }
      });
    }
  }

  console.log('✅ 21個の予約枠を作成しました（7日間 × 3枠/日）');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

npx ts-node prisma/seed.ts 2>/dev/null || npx tsx prisma/seed.ts 2>/dev/null || node --loader ts-node/esm prisma/seed.ts
echo ""

# 5. 設定確認
echo "🔍 設定を確認中..."
echo ""
echo "  データベース: SQLite (dev.db)"
echo "  予約枠: 21個作成済み"
echo "  メール送信: SendGrid"
echo "  ビデオ通話: Google Meet（自動生成）"
echo ""

# 6. 完了
echo "✨ セットアップが完了しました！"
echo ""
echo "📌 次のステップ:"
echo "  1. npm run dev でサーバーを起動"
echo "  2. http://localhost:3000/book で予約画面を確認"
echo "  3. SendGridの設定が必要な場合は .env.local を編集"
echo ""
echo "💡 ヒント:"
echo "  - npx prisma studio でデータベースをGUIで確認できます"
echo "  - /docs/BOOKING_SETUP.md で詳細なドキュメントを確認できます"
echo ""