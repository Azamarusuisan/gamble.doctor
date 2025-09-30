import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cancelSchema = z.object({
  appointmentId: z.string(),
  reason: z.string().optional(),
  patientEmail: z.string().email()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = cancelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { appointmentId, reason, patientEmail } = validation.data;

    // 予約の存在確認と患者の確認
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patient: {
          email: patientEmail
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

    // キャンセル可能時間のチェック（24時間前まで）
    const now = new Date();
    const appointmentTime = new Date(appointment.slot.start);
    const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return NextResponse.json(
        { error: "予約の24時間前を過ぎているためキャンセルできません" },
        { status: 400 }
      );
    }

    // トランザクションでキャンセル処理
    const result = await prisma.$transaction(async (tx: any) => {
      // 予約をキャンセル状態に更新
      const canceledAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "canceled",
          metadata: {
            canceledAt: new Date().toISOString(),
            cancelReason: reason || "患者都合によるキャンセル"
          }
        }
      });

      // スロットを再度利用可能にする
      await tx.slot.update({
        where: { id: appointment.slot.id },
        data: { status: "available" }
      });

      // 監査ログを記録
      await tx.auditLog.create({
        data: {
          action: "appointment.canceled",
          entityId: appointmentId,
          entityType: "appointment",
          metadata: {
            reason: reason || "患者都合によるキャンセル",
            canceledBy: patientEmail,
            hoursBeforeAppointment: hoursUntilAppointment
          }
        }
      });

      return canceledAppointment;
    });

    return NextResponse.json({
      success: true,
      message: "予約をキャンセルしました",
      appointmentId: result.id,
      refundPolicy: hoursUntilAppointment >= 48 ? "全額返金" : "50%返金"
    });

  } catch (error) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json(
      { error: "予約のキャンセルに失敗しました" },
      { status: 500 }
    );
  }
}