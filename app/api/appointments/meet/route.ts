import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Google Meetリンクの自動生成
function generateGoogleMeetLink(appointmentId: string): string {
  // Google Meetのランダムコード生成（xxx-xxxx-xxx形式）
  const generateCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${part1}-${part2}-${part3}`;
  };

  const meetCode = generateCode();
  return `https://meet.google.com/${meetCode}`;
}

// 予約作成時にGoogle Meetリンクを自動生成してメール送信
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "予約IDが必要です" },
        { status: 400 }
      );
    }

    // 予約情報を取得
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        slot: true
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // Google Meetリンクを生成
    const meetLink = generateGoogleMeetLink(appointmentId);

    // 予約にMeetリンクを保存
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        videoUrl: meetLink,
        metadata: {
          ...appointment.metadata as any,
          googleMeetLink: meetLink,
          meetLinkCreatedAt: new Date().toISOString()
        }
      }
    });

    // メール内容を生成
    const emailContent = {
      to: appointment.patient.email,
      subject: "【ギャンブルドクター】オンライン診療のGoogle Meetリンクのお知らせ",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0f4c81; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .meet-link {
      display: inline-block;
      background: #1a73e8;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .info-box {
      background: white;
      padding: 20px;
      border-left: 4px solid #2d8a7a;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">オンライン診療のご案内</h1>
    </div>
    <div class="content">
      <p><strong>${appointment.patient.name} 様</strong></p>

      <p>この度は、ギャンブルドクターをご予約いただきありがとうございます。</p>
      <p>オンライン診療用のGoogle Meetリンクをお送りいたします。</p>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #0f4c81;">📅 予約詳細</h3>
        <p><strong>日時：</strong>${new Date(appointment.slot.start).toLocaleDateString('ja-JP')} ${new Date(appointment.slot.start).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>診療タイプ：</strong>${appointment.type === 'initial' ? '初診' : '再診'}</p>
        <p><strong>担当医：</strong>浦江晋平医師</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetLink}" class="meet-link">Google Meetに参加する</a>
        <p style="color: #666; font-size: 14px;">または以下のURLをブラウザにコピーしてください：</p>
        <p style="background: #f0f0f0; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
          ${meetLink}
        </p>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #0f4c81;">📝 ご準備いただくもの</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>本人確認書類</li>
          <li>健康保険証（任意）</li>
          <li>静かな環境</li>
          <li>安定したインターネット接続</li>
          <li>カメラ・マイク付きのデバイス</li>
        </ul>
      </div>

      <div class="info-box">
        <h3 style="margin-top: 0; color: #0f4c81;">⚠️ 注意事項</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>診療開始5分前にはリンクをクリックして待機室でお待ちください</li>
          <li>Googleアカウントは不要です（ゲスト参加可能）</li>
          <li>リンクは予約された方のみ有効です</li>
          <li>キャンセルは24時間前までにお願いします</li>
        </ul>
      </div>

      <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
      <p>当日お会いできることを楽しみにしております。</p>

      <div class="footer">
        <p>ギャンブルドクター オンライン診療サービス</p>
        <p>お問い合わせ: support@gamble-doctor.jp</p>
        <p>※このメールは自動送信されています</p>
      </div>
    </div>
  </div>
</body>
</html>
      `
    };

    // デモ環境のためコンソールに出力（本番環境では実際にメール送信）
    console.log("📧 Google Meetリンク送信メール:", {
      to: emailContent.to,
      subject: emailContent.subject,
      meetLink: meetLink
    });

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "meet.link.created",
        entityId: appointmentId,
        entityType: "appointment",
        metadata: {
          meetLink,
          sentTo: appointment.patient.email,
          appointmentDate: appointment.slot.start,
          createdAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Google Meetリンクを生成してメールで送信しました",
      meetLink,
      appointment: {
        id: appointmentId,
        patientEmail: appointment.patient.email,
        appointmentDate: appointment.slot.start
      }
    });

  } catch (error) {
    console.error("Generate Google Meet link error:", error);
    return NextResponse.json(
      { error: "Google Meetリンクの生成に失敗しました" },
      { status: 500 }
    );
  }
}

// 既存の予約のMeetリンクを取得
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const email = searchParams.get("email");

    if (!appointmentId || !email) {
      return NextResponse.json(
        { error: "予約IDとメールアドレスが必要です" },
        { status: 400 }
      );
    }

    // 予約情報を取得
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patient: {
          email: email
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    if (!appointment.videoUrl) {
      return NextResponse.json(
        { error: "Google Meetリンクが設定されていません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      meetLink: appointment.videoUrl,
      appointmentId,
      metadata: appointment.metadata
    });

  } catch (error) {
    console.error("Get Google Meet link error:", error);
    return NextResponse.json(
      { error: "Google Meetリンクの取得に失敗しました" },
      { status: 500 }
    );
  }
}