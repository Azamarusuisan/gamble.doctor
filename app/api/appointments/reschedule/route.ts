import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const rescheduleSchema = z.object({
  appointmentId: z.string(),
  newSlotId: z.string(),
  patientEmail: z.string().email(),
  reason: z.string().optional()
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = rescheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { appointmentId, newSlotId, patientEmail, reason } = validation.data;

    // 現在の予約を確認
    const currentAppointment = await prisma.appointment.findFirst({
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

    if (!currentAppointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // 変更可能時間のチェック（24時間前まで）
    const now = new Date();
    const currentAppointmentTime = new Date(currentAppointment.slot.start);
    const hoursUntilAppointment = (currentAppointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return NextResponse.json(
        { error: "予約の24時間前を過ぎているため変更できません" },
        { status: 400 }
      );
    }

    // 新しいスロットの確認
    const newSlot = await prisma.slot.findUnique({
      where: { id: newSlotId }
    });

    if (!newSlot || newSlot.status !== "available") {
      return NextResponse.json(
        { error: "選択された時間枠は利用できません" },
        { status: 400 }
      );
    }

    // トランザクションで予約変更処理
    const result = await prisma.$transaction(async (tx: any) => {
      // 古いスロットを利用可能にする
      await tx.slot.update({
        where: { id: currentAppointment.slot.id },
        data: { status: "available" }
      });

      // 新しいスロットを予約済みにする
      await tx.slot.update({
        where: { id: newSlotId },
        data: { status: "booked" }
      });

      // 予約情報を更新
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          slotId: newSlotId,
          metadata: {
            ...currentAppointment.metadata as any,
            rescheduledAt: new Date().toISOString(),
            rescheduleReason: reason || "日程変更",
            previousSlotId: currentAppointment.slot.id
          }
        },
        include: {
          slot: true,
          patient: true
        }
      });

      // 監査ログを記録
      await tx.auditLog.create({
        data: {
          action: "appointment.rescheduled",
          entityId: appointmentId,
          entityType: "appointment",
          metadata: {
            oldSlotId: currentAppointment.slot.id,
            newSlotId: newSlotId,
            reason: reason || "日程変更",
            rescheduledBy: patientEmail
          }
        }
      });

      return updatedAppointment;
    });

    return NextResponse.json({
      success: true,
      message: "予約を変更しました",
      appointment: {
        id: result.id,
        type: result.type,
        status: result.status,
        newDate: result.slot.start,
        newTime: {
          start: result.slot.start,
          end: result.slot.end
        }
      }
    });

  } catch (error) {
    console.error("Reschedule appointment error:", error);
    return NextResponse.json(
      { error: "予約の変更に失敗しました" },
      { status: 500 }
    );
  }
}