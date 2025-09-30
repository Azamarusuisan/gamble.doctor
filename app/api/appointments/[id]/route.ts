import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { AppointmentStatusUpdateSchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";

const statusMap = {
  booked: "booked",
  canceled: "canceled",
  no_show: "no_show"
} as const;

const typeMap = {
  初診: "first",
  再診: "follow"
} as const;

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: {
      Patient: true,
      Slot: true
    }
  });

  if (!appointment) {
    return errorResponse(404, "NOT_FOUND", "予約が見つかりません");
  }

  return ok({
    id: appointment.id,
    status: appointment.status,
    patient: {
      name: appointment.Patient.name,
      email: appointment.Patient.email
    },
    slot: {
      start: appointment.Slot.start.toISOString(),
      end: appointment.Slot.end.toISOString()
    },
    videoUrl: appointment.videoUrl
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = AppointmentStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "更新内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const data = parsed.data;

  try {
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(data.status ? { status: statusMap[data.status] } : {}),
        ...(data.type ? { type: typeMap[data.type] } : {})
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "updated_appointment",
        appointmentId: appointment.id,
        target: `Appointment:${appointment.id}`,
        meta: JSON.stringify(data)
      }
    });

    return ok({ id: appointment.id, status: appointment.status });
  } catch (error) {
    console.error(error);
    return errorResponse(500, "INTERNAL_ERROR", "更新に失敗しました");
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appointment) {
    return errorResponse(404, "NOT_FOUND", "予約が見つかりません");
  }

  await prisma.$transaction(async (tx) => {
    await tx.appointment.update({
      where: { id: params.id },
      data: { status: "canceled" }
    });

    await tx.slot.update({
      where: { id: appointment.slotId },
      data: { status: "available" }
    });

    await tx.auditLog.create({
      data: {
        action: "canceled_appointment",
        appointmentId: appointment.id,
        target: `Appointment:${appointment.id}`
      }
    });
  });

  return new Response(null, { status: 204 });
}
