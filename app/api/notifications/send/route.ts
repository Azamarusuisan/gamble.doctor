import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 通知送信スキーマ
const notificationSchema = z.object({
  type: z.enum(["email", "sms", "both"]),
  recipient: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    name: z.string()
  }),
  template: z.enum(["appointment_confirmation", "appointment_reminder", "appointment_canceled", "payment_success", "custom"]),
  data: z.record(z.any()),
  scheduledFor: z.string().optional()
});

// メールテンプレート生成
function generateEmailContent(template: string, data: any) {
  const templates: Record<string, { subject: string; body: string }> = {
    appointment_confirmation: {
      subject: "【ギャンブルドクター】予約確認のお知らせ",
      body: `
${data.patientName} 様

この度は、ギャンブルドクターをご利用いただきありがとうございます。
以下の内容で予約を承りました。

━━━━━━━━━━━━━━━━━━
■ 予約内容
━━━━━━━━━━━━━━━━━━
日時：${data.date} ${data.time}
診療タイプ：${data.type}
担当医：浦江晋平医師
場所：オンライン診療

ビデオ通話URL：
${data.videoUrl || '予約日前日にお送りします'}

━━━━━━━━━━━━━━━━━━
■ ご準備いただくもの
━━━━━━━━━━━━━━━━━━
・本人確認書類
・健康保険証（任意）
・静かな環境
・安定したインターネット接続

━━━━━━━━━━━━━━━━━━
■ 注意事項
━━━━━━━━━━━━━━━━━━
・開始5分前にはビデオ通話の準備をお願いします
・キャンセルは24時間前までにお願いします
・ご不明な点がございましたらお問い合わせください

ギャンブルドクター
お問い合わせ：support@gamble-doctor.jp
      `
    },
    appointment_reminder: {
      subject: "【リマインダー】明日の診療予約のお知らせ",
      body: `
${data.patientName} 様

明日の診療予約についてお知らせいたします。

日時：${data.date} ${data.time}
診療タイプ：${data.type}
ビデオ通話URL：${data.videoUrl}

お忘れのないようお願いいたします。

ギャンブルドクター
      `
    },
    appointment_canceled: {
      subject: "【ギャンブルドクター】予約キャンセル完了のお知らせ",
      body: `
${data.patientName} 様

予約のキャンセルを承りました。

キャンセルされた予約：
日時：${data.date} ${data.time}
診療タイプ：${data.type}

返金について：${data.refundPolicy || '規定に従い処理いたします'}

またのご利用をお待ちしております。

ギャンブルドクター
      `
    },
    payment_success: {
      subject: "【ギャンブルドクター】決済完了のお知らせ",
      body: `
${data.patientName} 様

決済が正常に完了しました。

━━━━━━━━━━━━━━━━━━
■ 決済内容
━━━━━━━━━━━━━━━━━━
金額：¥${data.amount}
決済方法：${data.paymentMethod}
決済ID：${data.paymentId}
日時：${data.paidAt}

━━━━━━━━━━━━━━━━━━
■ 予約内容
━━━━━━━━━━━━━━━━━━
日時：${data.appointmentDate}
診療タイプ：${data.appointmentType}

領収書は別途メールでお送りします。

ギャンブルドクター
      `
    },
    custom: {
      subject: data.subject || "【ギャンブルドクター】お知らせ",
      body: data.body || ""
    }
  };

  return templates[template] || templates.custom;
}

// SMS テンプレート生成
function generateSMSContent(template: string, data: any) {
  const templates: Record<string, string> = {
    appointment_confirmation: `【ギャンブルドクター】
予約確認
${data.date} ${data.time}
${data.type}
詳細はメールをご確認ください`,

    appointment_reminder: `【ギャンブルドクター】
明日の予約リマインダー
${data.date} ${data.time}
お忘れなく`,

    appointment_canceled: `【ギャンブルドクター】
予約キャンセル完了
${data.date}の予約をキャンセルしました`,

    payment_success: `【ギャンブルドクター】
決済完了 ¥${data.amount}
予約: ${data.appointmentDate}`,

    custom: data.message || ""
  };

  return templates[template] || templates.custom;
}

// 通知送信エンドポイント
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = notificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { type, recipient, template, data, scheduledFor } = validation.data;
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 送信する通知を準備
    const notifications = [];

    // メール送信
    if (type === "email" || type === "both") {
      if (!recipient.email) {
        return NextResponse.json(
          { error: "メールアドレスが必要です" },
          { status: 400 }
        );
      }

      const emailContent = generateEmailContent(template, { ...data, patientName: recipient.name });

      notifications.push({
        id: `${notificationId}_email`,
        type: "email",
        to: recipient.email,
        subject: emailContent.subject,
        body: emailContent.body,
        status: "pending",
        scheduledFor: scheduledFor || null
      });

      // 実際のメール送信処理（デモではコンソール出力）
      console.log("📧 Email notification:", {
        to: recipient.email,
        subject: emailContent.subject,
        body: emailContent.body
      });
    }

    // SMS送信
    if (type === "sms" || type === "both") {
      if (!recipient.phone) {
        return NextResponse.json(
          { error: "電話番号が必要です" },
          { status: 400 }
        );
      }

      const smsContent = generateSMSContent(template, data);

      notifications.push({
        id: `${notificationId}_sms`,
        type: "sms",
        to: recipient.phone,
        message: smsContent,
        status: "pending",
        scheduledFor: scheduledFor || null
      });

      // 実際のSMS送信処理（デモではコンソール出力）
      console.log("📱 SMS notification:", {
        to: recipient.phone,
        message: smsContent
      });
    }

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "notification.sent",
        entityId: notificationId,
        entityType: "notification",
        metadata: {
          type,
          template,
          recipient: {
            name: recipient.name,
            email: recipient.email || null,
            phone: recipient.phone || null
          },
          notifications,
          sentAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      notificationId,
      notifications,
      message: `通知を${notifications.length}件送信しました`
    });

  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "通知の送信に失敗しました" },
      { status: 500 }
    );
  }
}

// 通知ステータス確認
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");

    if (!notificationId) {
      return NextResponse.json(
        { error: "通知IDが必要です" },
        { status: 400 }
      );
    }

    // 監査ログから通知情報を取得
    const notificationLog = await prisma.auditLog.findFirst({
      where: {
        action: "notification.sent",
        entityId: notificationId
      }
    });

    if (!notificationLog) {
      return NextResponse.json(
        { error: "通知が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: notificationLog.metadata
    });

  } catch (error) {
    console.error("Get notification status error:", error);
    return NextResponse.json(
      { error: "通知ステータスの取得に失敗しました" },
      { status: 500 }
    );
  }
}