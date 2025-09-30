import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 明日の予約を取得
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: "confirmed",
        slot: {
          start: {
            gte: tomorrow,
            lt: dayAfterTomorrow
          }
        }
      },
      include: {
        slot: true,
        patient: true
      }
    });

    // リマインダー送信処理（実際の実装では外部サービスと連携）
    const reminders = appointments.map(async (appointment: any) => {
      const reminderData = {
        appointmentId: appointment.id,
        patientName: appointment.patient.name,
        patientEmail: appointment.patient.email,
        patientPhone: appointment.patient.phone,
        appointmentDate: appointment.slot.start,
        appointmentTime: {
          start: new Date(appointment.slot.start).toLocaleTimeString("ja-JP"),
          end: new Date(appointment.slot.end).toLocaleTimeString("ja-JP")
        },
        type: appointment.type,
        videoUrl: appointment.videoUrl || "追って連絡いたします"
      };

      // 監査ログに記録
      await prisma.auditLog.create({
        data: {
          action: "reminder.sent",
          entityId: appointment.id,
          entityType: "appointment",
          metadata: reminderData
        }
      });

      return reminderData;
    });

    const sentReminders = await Promise.all(reminders);

    return NextResponse.json({
      success: true,
      message: `${sentReminders.length}件のリマインダーを送信しました`,
      reminders: sentReminders
    });

  } catch (error) {
    console.error("Send reminders error:", error);
    return NextResponse.json(
      { error: "リマインダーの送信に失敗しました" },
      { status: 500 }
    );
  }
}

// 手動でリマインダーを送信
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

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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

    // リマインダーデータの作成
    const reminderData = {
      to: appointment.patient.email,
      subject: "【ギャンブルドクター】明日の診療予約のお知らせ",
      patientName: appointment.patient.name,
      appointmentDate: new Date(appointment.slot.start).toLocaleDateString("ja-JP"),
      appointmentTime: new Date(appointment.slot.start).toLocaleTimeString("ja-JP"),
      type: appointment.type === "initial" ? "初診" : "再診",
      videoUrl: appointment.videoUrl || "追って連絡いたします",
      notes: [
        "開始時刻の5分前にはビデオ通話の準備をお願いします",
        "静かな環境でご参加ください",
        "ご本人確認書類をご準備ください"
      ]
    };

    // デモ環境のため、実際にはメールは送信されない
    console.log("リマインダー送信（デモ）:", reminderData);

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "reminder.manual",
        entityId: appointmentId,
        entityType: "appointment",
        metadata: reminderData
      }
    });

    return NextResponse.json({
      success: true,
      message: "リマインダーを送信しました",
      reminder: reminderData
    });

  } catch (error) {
    console.error("Send manual reminder error:", error);
    return NextResponse.json(
      { error: "リマインダーの送信に失敗しました" },
      { status: 500 }
    );
  }
}