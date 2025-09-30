import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  email: z.string().email(),
  status: z.enum(["pending", "confirmed", "completed", "canceled"]).optional()
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      );
    }

    // メールアドレスの検証
    const validation = querySchema.safeParse({ email, status });
    if (!validation.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // 患者情報の取得
    const patient = await prisma.patient.findUnique({
      where: { email }
    });

    if (!patient) {
      return NextResponse.json(
        { error: "患者情報が見つかりません" },
        { status: 404 }
      );
    }

    // 予約情報の取得
    const whereCondition: any = {
      patientId: patient.id
    };

    if (status) {
      whereCondition.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        slot: true,
        patient: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        slot: {
          start: "desc"
        }
      }
    });

    // レスポンスの整形
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      type: appointment.type,
      status: appointment.status,
      videoUrl: appointment.videoUrl,
      date: appointment.slot.start,
      time: {
        start: appointment.slot.start,
        end: appointment.slot.end
      },
      patient: {
        name: appointment.patient.name,
        email: appointment.patient.email,
        phone: appointment.patient.phone
      },
      createdAt: appointment.createdAt,
      metadata: appointment.metadata
    }));

    return NextResponse.json({
      success: true,
      count: formattedAppointments.length,
      appointments: formattedAppointments
    });

  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "予約情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}