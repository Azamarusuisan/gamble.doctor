import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// カレンダー同期ステータスの取得
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      );
    }

    // 患者情報を取得
    const patient = await prisma.patient.findUnique({
      where: { email }
    });

    if (!patient) {
      return NextResponse.json(
        { error: "患者情報が見つかりません" },
        { status: 404 }
      );
    }

    // 今後の予約を取得
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        status: { not: "canceled" },
        slot: {
          start: {
            gte: new Date()
          }
        }
      },
      include: {
        slot: true
      },
      orderBy: {
        slot: {
          start: 'asc'
        }
      }
    });

    // 同期ステータスを生成
    const syncStatus = upcomingAppointments.map((appointment: any) => {
      const metadata = appointment.metadata as any || {};
      return {
        id: appointment.id,
        date: appointment.slot.start,
        type: appointment.type,
        syncedToGoogle: metadata.googleCalendarId ? true : false,
        syncedToOutlook: metadata.outlookEventId ? true : false,
        syncedToApple: metadata.appleCalendarId ? true : false,
        lastSyncTime: metadata.lastSyncTime || null
      };
    });

    return NextResponse.json({
      success: true,
      patientId: patient.id,
      totalAppointments: syncStatus.length,
      syncStatus
    });

  } catch (error) {
    console.error("Get calendar sync status error:", error);
    return NextResponse.json(
      { error: "同期ステータスの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// カレンダー同期の実行
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, calendarType, calendarId, email } = body;

    if (!appointmentId || !calendarType || !email) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }

    // 予約情報を確認
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patient: {
          email: email
        }
      },
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

    // メタデータを更新
    const currentMetadata = appointment.metadata as any || {};
    const updatedMetadata = {
      ...currentMetadata,
      lastSyncTime: new Date().toISOString()
    };

    // カレンダータイプに応じてIDを保存
    switch (calendarType.toLowerCase()) {
      case 'google':
        updatedMetadata.googleCalendarId = calendarId;
        break;
      case 'outlook':
        updatedMetadata.outlookEventId = calendarId;
        break;
      case 'apple':
        updatedMetadata.appleCalendarId = calendarId;
        break;
      default:
        return NextResponse.json(
          { error: "サポートされていないカレンダータイプです" },
          { status: 400 }
        );
    }

    // 予約情報を更新
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        metadata: updatedMetadata
      }
    });

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "calendar.synced",
        entityId: appointmentId,
        entityType: "appointment",
        metadata: {
          calendarType,
          calendarId,
          syncedBy: email
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `${calendarType}カレンダーと同期しました`,
      appointment: {
        id: updatedAppointment.id,
        syncStatus: {
          calendarType,
          calendarId,
          syncedAt: updatedMetadata.lastSyncTime
        }
      }
    });

  } catch (error) {
    console.error("Sync calendar error:", error);
    return NextResponse.json(
      { error: "カレンダー同期に失敗しました" },
      { status: 500 }
    );
  }
}

// カレンダー同期の解除
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const calendarType = searchParams.get("calendarType");
    const email = searchParams.get("email");

    if (!appointmentId || !calendarType || !email) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }

    // 予約情報を確認
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

    // メタデータを更新
    const currentMetadata = appointment.metadata as any || {};

    // カレンダータイプに応じてIDを削除
    switch (calendarType.toLowerCase()) {
      case 'google':
        delete currentMetadata.googleCalendarId;
        break;
      case 'outlook':
        delete currentMetadata.outlookEventId;
        break;
      case 'apple':
        delete currentMetadata.appleCalendarId;
        break;
    }

    // 予約情報を更新
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        metadata: currentMetadata
      }
    });

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: "calendar.unsynced",
        entityId: appointmentId,
        entityType: "appointment",
        metadata: {
          calendarType,
          unsyncedBy: email
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `${calendarType}カレンダーとの同期を解除しました`
    });

  } catch (error) {
    console.error("Unsync calendar error:", error);
    return NextResponse.json(
      { error: "カレンダー同期の解除に失敗しました" },
      { status: 500 }
    );
  }
}