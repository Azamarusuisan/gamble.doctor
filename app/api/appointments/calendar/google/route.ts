import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Google Calendar イベントURLの生成
function generateGoogleCalendarUrl(appointment: any): string {
  const startDate = new Date(appointment.slot.start);
  const endDate = new Date(appointment.slot.end);

  // Google Calendar用の日付フォーマット (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const title = encodeURIComponent(`ギャンブルドクター ${appointment.type === 'initial' ? '初診' : '再診'}`);

  const details = encodeURIComponent(
    `患者名: ${appointment.patient.name}\n` +
    `診療タイプ: ${appointment.type === 'initial' ? '初診' : '再診'}\n` +
    `ビデオURL: ${appointment.videoUrl || '追って連絡いたします'}\n\n` +
    `注意事項:\n` +
    `・開始5分前にはビデオ通話の準備をお願いします\n` +
    `・静かな環境でご参加ください\n` +
    `・ご本人確認書類をご準備ください`
  );

  const location = encodeURIComponent(appointment.videoUrl || 'オンライン診療');

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}&sf=true&output=xml`;

  return googleCalendarUrl;
}

// Google Calendarに予約を追加するためのURLを生成
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
      },
      include: {
        slot: true,
        patient: true
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // Google Calendar URLを生成
    const googleCalendarUrl = generateGoogleCalendarUrl(appointment);

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "calendar.google.generated",
        entityId: appointmentId,
        entityType: "appointment",
        metadata: {
          patientEmail: email,
          url: googleCalendarUrl
        }
      }
    });

    return NextResponse.json({
      success: true,
      googleCalendarUrl,
      appointment: {
        id: appointment.id,
        date: appointment.slot.start,
        type: appointment.type,
        patientName: appointment.patient.name
      }
    });

  } catch (error) {
    console.error("Generate Google Calendar URL error:", error);
    return NextResponse.json(
      { error: "Google Calendar URLの生成に失敗しました" },
      { status: 500 }
    );
  }
}

// Google Calendar Webhook用のエンドポイント（イベント変更通知を受け取る）
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, status, updatedTime, calendarId } = body;

    // Webhookの検証（本番環境では署名検証が必要）
    if (!eventId) {
      return NextResponse.json(
        { error: "イベントIDが必要です" },
        { status: 400 }
      );
    }

    // 予約情報を更新
    const appointment = await prisma.appointment.findUnique({
      where: { id: eventId }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // Googleカレンダーの変更に基づいて予約を更新
    if (status === 'cancelled') {
      await prisma.appointment.update({
        where: { id: eventId },
        data: {
          status: 'canceled',
          metadata: {
            ...appointment.metadata as any,
            googleCalendarCanceled: true,
            canceledAt: updatedTime
          }
        }
      });

      // スロットを開放
      await prisma.slot.update({
        where: { id: appointment.slotId },
        data: { status: 'available' }
      });
    }

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "calendar.google.webhook",
        entityId: eventId,
        entityType: "appointment",
        metadata: {
          status,
          updatedTime,
          calendarId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Webhook received successfully"
    });

  } catch (error) {
    console.error("Google Calendar webhook error:", error);
    return NextResponse.json(
      { error: "Webhookの処理に失敗しました" },
      { status: 500 }
    );
  }
}